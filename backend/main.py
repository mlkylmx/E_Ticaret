"""
MorPazar demo backend
Calistir: uvicorn main:app --reload
"""

from __future__ import annotations

import json
import os
import uuid
from datetime import datetime, timezone
from typing import Any

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from supabase import Client, create_client

load_dotenv()


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "").strip()
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://127.0.0.1:5500").strip()
GREEN_WEBHOOK_URL = os.getenv("GREEN_WEBHOOK_URL", "").strip()
WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "").strip()

ALLOWED_ORIGINS = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    FRONTEND_ORIGIN,
]


def normalize_supabase_url(url: str) -> str:
    if not url:
        return url
    return url.removesuffix("/").removesuffix("/rest/v1")


SUPABASE_URL = normalize_supabase_url(SUPABASE_URL)


def get_supabase_client() -> Client | None:
    if not SUPABASE_URL or not SUPABASE_KEY:
        return None
    return create_client(SUPABASE_URL, SUPABASE_KEY)


supabase = get_supabase_client()

app = FastAPI(title="MorPazar API", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(dict.fromkeys([origin for origin in ALLOWED_ORIGINS if origin])),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CustomerPayload(BaseModel):
    name: str = Field(min_length=1)
    email: EmailStr
    address: str = Field(min_length=1)


class OrderItemPayload(BaseModel):
    model_config = ConfigDict(extra="allow")

    product_id: int | None = None
    product_name: str
    brand: str | None = None
    seller: str | None = None
    sector: str | None = None
    quantity: int = 1
    unit_price: float = 0
    total_price: float = 0


class GreenOptionPayload(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str | None = None
    name: str
    sector: str | None = None
    vera_points: int = 0
    extra_price: float = 0


class OrderPayload(BaseModel):
    model_config = ConfigDict(extra="allow")

    event: str = "green_options_selected"
    source: str = "demo-marketplace"
    brand_id: str = "DEMO"
    order_id: str | None = None
    customer: CustomerPayload
    items: list[OrderItemPayload]
    sectors: list[str] = Field(default_factory=list)
    green_options: list[GreenOptionPayload] = Field(default_factory=list)
    total_products: float = 0
    total_green: float = 0
    grand_total: float = 0
    total_vera_points: int = 0
    timestamp: str | None = None
    leafpay_payload: dict[str, Any] | None = None


class OrderResponse(BaseModel):
    order_id: str
    status: str
    webhook_sent: bool
    webhook_error: str | None = None
    created_at: str


@app.get("/")
def root() -> dict[str, str]:
    return {"status": "ok", "service": "MorPazar API"}


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "service": "MorPazar API",
        "supabase_configured": bool(SUPABASE_URL and SUPABASE_KEY),
        "webhook_configured": bool(GREEN_WEBHOOK_URL),
        "timestamp": utc_now_iso(),
    }


@app.post("/orders", response_model=OrderResponse)
async def create_order(order: OrderPayload) -> OrderResponse:
    if not order.items:
        raise HTTPException(status_code=400, detail="Sipariste en az bir urun olmalidir.")

    if supabase is None:
        raise HTTPException(status_code=500, detail="Supabase ayarlari eksik.")

    created_at = utc_now_iso()
    order_id = order.order_id or f"DEMO-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"
    sectors = order.sectors or sorted({item.sector for item in order.items if item.sector})
    total_products = float(order.total_products or 0)
    total_green = 0.0
    grand_total = float(order.grand_total or total_products)

    webhook_sent = False
    webhook_error: str | None = None

    leafpay_payload = order.leafpay_payload or build_leafpay_payload(order, order_id=order_id, created_at=created_at)

    if GREEN_WEBHOOK_URL:
        webhook_sent, webhook_error = await send_webhook(leafpay_payload)

    order_row = {
        "order_id": order_id,
        "customer_name": order.customer.name,
        "customer_email": order.customer.email,
        "customer_address": order.customer.address,
        "items": [item.model_dump() for item in order.items],
        "sectors": sectors,
        "green_options": [option.model_dump() for option in order.green_options],
        "total_products": total_products,
        "total_green": total_green,
        "grand_total": grand_total,
        "total_vera_points": int(order.total_vera_points or 0),
        "source": order.source,
        "status": "confirmed",
        "webhook_sent": webhook_sent,
        "webhook_error": webhook_error,
        "created_at": created_at,
    }

    try:
        supabase.table("orders").insert(order_row).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Supabase orders kaydi basarisiz: {exc}") from exc

    if order.green_options:
        green_log_row = {
            "order_id": order_id,
            "customer_email": order.customer.email,
            "sectors": sectors,
            "green_options": [option.model_dump() for option in order.green_options],
            "total_vera_points": int(order.total_vera_points or 0),
            "webhook_sent": webhook_sent,
            "created_at": created_at,
        }
        try:
            supabase.table("green_options_log").insert(green_log_row).execute()
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Supabase green_options_log kaydi basarisiz: {exc}") from exc

    return OrderResponse(
        order_id=order_id,
        status="confirmed",
        webhook_sent=webhook_sent,
        webhook_error=webhook_error,
        created_at=created_at,
    )


def build_leafpay_payload(order: OrderPayload, *, order_id: str, created_at: str) -> dict[str, Any]:
    return {
        "event": order.event,
        "source": order.source,
        "brand_id": order.brand_id,
        "order_id": order_id,
        "customer": order.customer.model_dump(),
        "items": [item.model_dump() for item in order.items],
        "sectors": order.sectors or sorted({item.sector for item in order.items if item.sector}),
        "green_options": [option.model_dump() for option in order.green_options],
        "total_products": float(order.total_products or 0),
        "total_green": 0,
        "grand_total": float(order.grand_total or order.total_products or 0),
        "total_vera_points": int(order.total_vera_points or 0),
        "timestamp": order.timestamp or created_at,
    }


async def send_webhook(payload: dict[str, Any]) -> tuple[bool, str | None]:
    if not GREEN_WEBHOOK_URL:
        return False, None

    headers = {
        "Content-Type": "application/json",
        "X-Source": "demo-marketplace",
        "X-Event": payload.get("event", "green_options_selected"),
    }
    if WEBHOOK_SECRET:
        headers["Authorization"] = f"Bearer {WEBHOOK_SECRET}"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(GREEN_WEBHOOK_URL, json=payload, headers=headers)
            response.raise_for_status()
        return True, None
    except httpx.HTTPStatusError as exc:
        return False, f"HTTP {exc.response.status_code}: {exc.response.text[:300]}"
    except httpx.RequestError as exc:
        return False, f"Baglanti hatasi: {exc}"
    except Exception as exc:
        return False, str(exc)


@app.post("/test-webhook-receiver")
async def test_webhook_receiver(payload: dict[str, Any]) -> dict[str, Any]:
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return {"status": "received", "payload": payload}
