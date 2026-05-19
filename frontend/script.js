const API_BASE_URL = "https://morpazar-backend.onrender.com";

const products = [
  {
    id: 1,
    name: "Basic Pamuk Tişört",
    brand: "Koton",
    seller: "Koton",
    sector: "Tekstil & Giyim",
    price: 499,
    image: "https://ktnimg2.mncdn.com/products/2024/04/12/2735326/36d861d7-d1c9-4cd5-ace0-c0ca687f42fa_size870x1142.jpg",
  },
  {
    id: 2,
    name: "Mom Jean",
    brand: "Koton",
    seller: "Koton",
    sector: "Tekstil & Giyim",
    price: 1399,
    image: "https://ktnimg2.mncdn.com/products/2024/05/24/2926563/3afd81c8-f722-43e9-91fc-4424653ac627_size870x1142.jpg",
  },
  {
    id: 3,
    name: "Oversize Sweatshirt",
    brand: "Koton",
    seller: "Koton",
    sector: "Tekstil & Giyim",
    price: 899,
    image: "https://ktnimg2.mncdn.com/products/2025/10/10/3108356/3331585f-eea7-4c44-93c6-bcc9dd044576_size870x1142.jpg",
  },
  {
    id: 4,
    name: "Flormar Sheer Up Ruj 022",
    brand: "Flormar",
    seller: "Flormar",
    sector: "Kozmetik & Bakım",
    price: 779,
    image: "https://afb801.a-cdn.akinoncloud.com/products/2025/03/18/3902/62a133f0-8681-4ac7-b969-4696284e5a03_size960x1440_cropCenter.jpg",
  },
  {
    id: 5,
    name: "Flormar Volume Up Maskara",
    brand: "Flormar",
    seller: "Flormar",
    sector: "Kozmetik & Bakım",
    price: 1149,
    image: "https://afb801.a-cdn.akinoncloud.com/products/2025/10/13/9593/19e6b6d0-3247-41b3-9d89-d799a5bc27d3_size960x1440_cropCenter.jpg",
  },
  {
    id: 6,
    name: "Flormar Cover Up Fondöten",
    brand: "Flormar",
    seller: "Flormar",
    sector: "Kozmetik & Bakım",
    price: 1099,
    image: "https://afb801.a-cdn.akinoncloud.com/products/2026/02/24/9849/5491ab24-1813-4562-9c75-2854d7638f29_size960x1440_cropCenter.jpg",
  },
  {
    id: 7,
    name: "Eti Burçak Bisküvi",
    brand: "Eti",
    seller: "Eti",
    sector: "Gıda & Market",
    price: 25,
    image: "https://migrostoptanstr01.blob.core.windows.net/toptanimgs/07010112.jpg",
  },
  {
    id: 8,
    name: "Eti Lifalif Yulaf Ezmesi",
    brand: "Eti",
    seller: "Eti",
    sector: "Gıda & Market",
    price: 90,
    image: "https://images.migrosone.com/sanalmarket/product/05093202/5093202-422adc-1650x1650.jpg",
  },
  {
    id: 9,
    name: "Eti Karam Gurme",
    brand: "Eti",
    seller: "Eti",
    sector: "Gıda & Market",
    price: 30,
    image: "https://images.migrosone.com/sanalmarket/product/7160817/7160817_yan-bb899d-1650x1650.jpg",
  },
  {
    id: 10,
    name: "Koton Çiçekli Elbise",
    brand: "Koton",
    seller: "Koton",
    sector: "Tekstil & Giyim",
    price: 1079,
    image: "https://ktnimg2.mncdn.com/products/2024/06/28/127031/fcbc82df-4eb4-45a6-9e19-54a3b4461723_size870x1142.jpg",
  },
  {
    id: 11,
    name: "Flormar Göz Kalemi 005",
    brand: "Flormar",
    seller: "Flormar",
    sector: "Kozmetik & Bakım",
    price: 729,
    image: "https://afb801.a-cdn.akinoncloud.com/products/2023/05/08/5027/5fbfd79f-3990-4e25-a256-d40b61d625df_size960x1440_cropCenter.jpg",
  },
  {
    id: 12,
    name: "Eti Cin Portakallı Bisküvi",
    brand: "Eti",
    seller: "Eti",
    sector: "Gıda & Market",
    price: 7,
    image: "https://images.migrosone.com/sanalmarket/product/07010360/7010360_1-039b10-1650x1650.jpeg",
  },
];

const greenOptionsBySector = {
  "Tekstil & Giyim": [
    { key: "size_guide_confirm", name: "İade Azaltıcı Beden Rehberi Onayı", vera_points: 50 }
  ],

  "Gıda & Market": [ 
    { key: "recyclable_shipping_pack", name: "Geri Dönüştürülebilir Kargo Paketi", vera_points: 60 },
    { key: "nearest_warehouse", name: "Yakın Depodan Gönderim", vera_points: 60 }
  ],

  "Kozmetik & Bakım": [    
    { key: "recycling_point_info", name: "Ambalaj İade / Geri Dönüşüm Noktası Bilgilendirmesi", vera_points: 40 }
  ],
};

const universalGreenOptions = [
    { key: "single_package", name: "Tek Pakette Gönderim", vera_points: 40 },
    { id: "universal-digital-invoice", name: "Dijital Fatura", vera_points: 20, extra_price: 0 },
    { id: "universal-carbon", name: "Karbon Nötr Kargo", vera_points: 60, extra_price: 0 },
];

const state = {
  selectedSector: "all",
  selectedBrand: "all",
  searchTerm: "",
  sortBy: "default",
  cart: [],
  selectedGreenOptionIds: new Set(),
  checkoutStep: 1,
  currentView: "products",
};

const elements = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  populateFilters();
  bindEvents();
  renderProducts();
  renderCart();
  updateSectionTitle();
  updateCheckoutSteps();
  showView("products");
});

function cacheElements() {
  [
    "searchInput",
    "sectorFilter",
    "brandFilter",
    "sortSelect",
    "productsGrid",
    "resultsInfo",
    "sectionTitle",
    "cartBadge",
    "cartTrigger",
    "cartDrawer",
    "drawerOverlay",
    "drawerClose",
    "drawerItems",
    "drawerFoot",
    "drawerSubtotal",
    "drawerTotal",
    "btnCheckout",
    "productsView",
    "checkoutView",
    "successView",
    "backToShop",
    "backToShopFromDelivery",
    "greenOpts",
    "veraCount",
    "summaryItems",
    "summaryGreenList",
    "stProducts",
    "stTotal",
    "stVera",
    "fName",
    "fEmail",
    "fAddress",
    "btnPlaceOrder",
    "successOrderId",
    "successVeraText",
    "successClose",
    "successBackToShop",
    "toast",
    "continueToGreen",
    "continueToSummary",
    "backToDelivery",
    "backToGreen",
  ].forEach((id) => {
    elements[id] = document.getElementById(id);
  });
}

function bindEvents() {
  document.querySelectorAll(".nav-sector").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.currentView !== "products") {
        showView("products");
      }
      state.selectedSector = button.dataset.sector;
      elements.sectorFilter.value = state.selectedSector;
      setActiveSectorButton(state.selectedSector);
      updateSectionTitle();
      renderProducts();
    });
  });

  elements.searchInput.addEventListener("input", (event) => {
    if (state.currentView !== "products") {
      showView("products");
    }
    state.searchTerm = event.target.value.trim().toLocaleLowerCase("tr-TR");
    renderProducts();
  });

  elements.sectorFilter.addEventListener("change", (event) => {
    state.selectedSector = event.target.value;
    setActiveSectorButton(state.selectedSector);
    updateSectionTitle();
    renderProducts();
  });

  elements.brandFilter.addEventListener("change", (event) => {
    state.selectedBrand = event.target.value;
    renderProducts();
  });

  elements.sortSelect.addEventListener("change", (event) => {
    state.sortBy = event.target.value;
    renderProducts();
  });

  elements.cartTrigger.addEventListener("click", openCart);
  elements.drawerOverlay.addEventListener("click", closeCart);
  elements.drawerClose.addEventListener("click", closeCart);
  elements.btnCheckout.addEventListener("click", openCheckout);
  elements.backToShop.addEventListener("click", returnToShop);
  elements.backToShopFromDelivery.addEventListener("click", returnToShop);
  elements.successClose.addEventListener("click", resetAfterSuccess);
  elements.successBackToShop.addEventListener("click", returnToShop);
  elements.continueToGreen.addEventListener("click", () => goStep(2));
  elements.continueToSummary.addEventListener("click", () => goStep(3));
  elements.backToDelivery.addEventListener("click", () => goStep(1));
  elements.backToGreen.addEventListener("click", () => goStep(2));
  elements.btnPlaceOrder.addEventListener("click", placeOrder);
}

function showView(view) {
  state.currentView = view;
  elements.productsView.classList.toggle("hidden", view !== "products");
  elements.checkoutView.classList.toggle("hidden", view !== "checkout");
  elements.successView.classList.toggle("hidden", view !== "success");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function returnToShop() {
  showView("products");
}

function resetAfterSuccess() {
  elements.fName.value = "";
  elements.fEmail.value = "";
  elements.fAddress.value = "";
  showView("products");
}

function populateFilters() {
  const sectors = [...new Set(products.map((product) => product.sector))];
  const brands = [...new Set(products.map((product) => product.brand))].sort((a, b) => a.localeCompare(b, "tr"));

  elements.sectorFilter.innerHTML = ['<option value="all">Tüm sektörler</option>']
    .concat(sectors.map((sector) => `<option value="${escapeHtml(sector)}">${escapeHtml(sector)}</option>`))
    .join("");

  elements.brandFilter.innerHTML = ['<option value="all">Tüm markalar</option>']
    .concat(brands.map((brand) => `<option value="${escapeHtml(brand)}">${escapeHtml(brand)}</option>`))
    .join("");
}

function getFilteredProducts() {
  const term = state.searchTerm;

  return products
    .filter((product) => state.selectedSector === "all" || product.sector === state.selectedSector)
    .filter((product) => state.selectedBrand === "all" || product.brand === state.selectedBrand)
    .filter((product) => {
      if (!term) return true;
      const haystack = `${product.name} ${product.brand} ${product.seller} ${product.sector}`.toLocaleLowerCase("tr-TR");
      return haystack.includes(term);
    })
    .sort((left, right) => {
      switch (state.sortBy) {
        case "price-asc":
          return left.price - right.price;
        case "price-desc":
          return right.price - left.price;
        default:
          return left.id - right.id;
      }
    });
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();

  if (!filteredProducts.length) {
    elements.productsGrid.innerHTML = '<div class="empty-products">Aradığınız kriterlere uygun ürün bulunamadı.</div>';
    elements.resultsInfo.textContent = "0 ürün gösteriliyor";
    return;
  }

  elements.productsGrid.innerHTML = filteredProducts
    .map((product) => {
      const fallbackText = `${product.brand} ${product.sector}`;
      return `
        <article class="product-card">
          <div class="product-media">
            <img
              class="product-image"
              src="${escapeHtml(product.image)}"
              alt="${escapeHtml(product.name)}"
              loading="lazy"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';"
            >
            <div class="product-image-fallback" style="display:none">${escapeHtml(fallbackText)}</div>
          </div>
          <div class="product-copy">
            <p class="product-brand">${escapeHtml(product.seller)}</p>
            <h3>${escapeHtml(product.name)}</h3>
            <p>${escapeHtml(product.sector)}</p>
          </div>
          <div class="product-action-row">
            <div class="price-box">
              <strong>${formatCurrency(product.price)}</strong>
            </div>
            <button class="add-cart-btn" type="button" data-product-id="${product.id}">Sepete Ekle</button>
          </div>
        </article>
      `;
    })
    .join("");

  elements.resultsInfo.textContent = `${filteredProducts.length} ürün gösteriliyor`;

  elements.productsGrid.querySelectorAll(".add-cart-btn").forEach((button) => {
    button.addEventListener("click", () => addToCart(Number(button.dataset.productId)));
  });
}

function addToCart(productId) {
  const existingItem = state.cart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    state.cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  showToast("Ürün sepete eklendi.");
}

function changeQuantity(productId, delta) {
  const item = state.cart.find((cartItem) => cartItem.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== productId);
  pruneInvalidGreenSelections();
  renderCart();
}

function renderCart() {
  const { subtotal, grandTotal, totalCount } = getCartTotals();

  if (!state.cart.length) {
    elements.drawerItems.innerHTML = `
      <div class="empty-state">
        <div class="es-icon">MP</div>
        <p>Sepetiniz boş. Ürün ekleyerek alışverişe başlayın.</p>
      </div>
    `;
    elements.drawerFoot.style.display = "none";
  } else {
    elements.drawerItems.innerHTML = state.cart
      .map((item) => `
        <article class="cart-item">
          <div>
            <p class="cart-item-brand">Satıcı: ${escapeHtml(item.seller)}</p>
            <h4 class="cart-item-title">${escapeHtml(item.name)}</h4>
            <p class="cart-item-sector">${escapeHtml(item.sector)} · Marka: ${escapeHtml(item.brand)}</p>
          </div>
          <div class="cart-item-bottom">
            <div>
              <strong class="cart-item-price">${formatCurrency(item.price * item.quantity)}</strong>
              <p class="cart-item-unit">${formatCurrency(item.price)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-controls">
              <button class="qty-btn" type="button" data-action="decrease" data-product-id="${item.id}">−</button>
              <span>${item.quantity}</span>
              <button class="qty-btn" type="button" data-action="increase" data-product-id="${item.id}">+</button>
              <button class="remove-btn" type="button" data-action="remove" data-product-id="${item.id}">Sil</button>
            </div>
          </div>
        </article>
      `)
      .join("");

    elements.drawerFoot.style.display = "grid";
  }

  elements.cartBadge.textContent = totalCount;
  elements.cartBadge.style.display = totalCount > 0 ? "inline-flex" : "none";
  elements.drawerSubtotal.textContent = formatCurrency(subtotal);
  elements.drawerTotal.textContent = formatCurrency(grandTotal);

  elements.drawerItems.querySelectorAll("[data-action]").forEach((button) => {
    const productId = Number(button.dataset.productId);
    const action = button.dataset.action;
    button.addEventListener("click", () => {
      if (action === "increase") changeQuantity(productId, 1);
      if (action === "decrease") changeQuantity(productId, -1);
      if (action === "remove") removeFromCart(productId);
    });
  });

  renderSummary();
}

function openCart() {
  elements.cartDrawer.classList.add("open");
  elements.drawerOverlay.classList.add("open");
}

function closeCart() {
  elements.cartDrawer.classList.remove("open");
  elements.drawerOverlay.classList.remove("open");
}

function openCheckout() {
  if (!state.cart.length) {
    showToast("Checkout için önce sepete ürün ekleyin.");
    return;
  }

  closeCart();
  state.checkoutStep = 1;
  renderGreenOptions();
  renderSummary();
  updateCheckoutSteps();
  showView("checkout");
}

function goStep(step) {
  if (step === 2 && !validateCustomerFields()) return;
  if (step === 3 && !validateCustomerFields()) {
    state.checkoutStep = 1;
    updateCheckoutSteps();
    return;
  }

  state.checkoutStep = step;
  if (step === 2) renderGreenOptions();
  if (step === 3) renderSummary();
  updateCheckoutSteps();
}

function updateCheckoutSteps() {
  const stepMap = {
    1: document.getElementById("stepDelivery"),
    2: document.getElementById("stepGreen"),
    3: document.getElementById("stepSummary"),
  };

  Object.entries(stepMap).forEach(([key, node]) => {
    if (!node) return;
    node.classList.toggle("hidden", Number(key) !== state.checkoutStep);
  });

  [1, 2, 3].forEach((number) => {
    const stepNode = document.getElementById(`ms${number}`);
    if (stepNode) {
      stepNode.classList.toggle("active", number === state.checkoutStep);
    }
  });
}

function renderGreenOptions() {
  const groups = getEligibleGreenOptionGroups();

  elements.greenOpts.innerHTML = groups
    .map((group) => `
      <section class="green-group">
        <h5 class="green-group-title">${escapeHtml(group.title)}</h5>
        <p class="green-subtitle">${escapeHtml(group.subtitle)}</p>
        <div class="green-grid">
          ${group.options
            .map((option) => `
              <label class="green-option">
                <input type="checkbox" data-green-id="${option.id}" ${state.selectedGreenOptionIds.has(option.id) ? "checked" : ""}>
                <div class="green-option-card">
                  <div class="green-option-copy">
                    <strong>${escapeHtml(option.name)}</strong>
                    <span>${escapeHtml(option.groupLabel)}</span>
                  </div>
                  <div class="green-option-side">
                    <strong>+${option.vera_points} VERA</strong>
                  </div>
                </div>
              </label>
            `)
            .join("")}
        </div>
      </section>
    `)
    .join("");

  elements.greenOpts.querySelectorAll("[data-green-id]").forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        state.selectedGreenOptionIds.add(input.dataset.greenId);
      } else {
        state.selectedGreenOptionIds.delete(input.dataset.greenId);
      }
      renderCart();
      renderSummary();
      updateVeraPreview();
    });
  });

  updateVeraPreview();
}

function renderSummary() {
  const { subtotal, grandTotal, totalVeraPoints } = getCartTotals();
  const selectedGreenOptions = getSelectedGreenOptions();

  elements.summaryItems.innerHTML = state.cart
    .map((item) => `
      <div class="summary-item">
        <div class="summary-item-top">
          <strong>${escapeHtml(item.name)}</strong>
          <strong>${formatCurrency(item.price * item.quantity)}</strong>
        </div>
        <div class="summary-item-bottom">
          <span>${escapeHtml(item.seller)} · ${item.quantity} adet</span>
          <span>${escapeHtml(item.sector)}</span>
        </div>
      </div>
    `)
    .join("");

  elements.summaryGreenList.innerHTML = selectedGreenOptions.length
    ? selectedGreenOptions
        .map((option) => `
          <div class="summary-green-item">
            <div>
              <strong>${escapeHtml(option.name)}</strong>
              <small>${escapeHtml(option.groupLabel)}</small>
            </div>
            <div>
              <small>+${option.vera_points} VERA</small>
            </div>
          </div>
        `)
        .join("")
    : '<div class="summary-green-item"><div><strong>Yeşil seçenek seçilmedi</strong><small>Standart sipariş akışı</small></div><div><small>0 VERA</small></div></div>';

  elements.stProducts.textContent = formatCurrency(subtotal);
  elements.stTotal.textContent = formatCurrency(grandTotal);
  elements.stVera.textContent = `${totalVeraPoints} puan`;
}

function updateVeraPreview() {
  const { totalVeraPoints } = getCartTotals();
  elements.veraCount.textContent = `${totalVeraPoints} puan`;
}

function validateCustomerFields() {
  const name = elements.fName.value.trim();
  const email = elements.fEmail.value.trim();
  const address = elements.fAddress.value.trim();

  if (!name || !email || !address) {
    showToast("Ad soyad, e-posta ve adres alanlarını doldurun.");
    return false;
  }

  return true;
}

async function placeOrder() {
  if (!validateCustomerFields()) {
    state.checkoutStep = 1;
    updateCheckoutSteps();
    return;
  }

  const payload = buildOrderPayload();
  const buttonLabel = elements.btnPlaceOrder.querySelector("span");
  elements.btnPlaceOrder.disabled = true;
  buttonLabel.textContent = "Sipariş hazırlanıyor...";

  try {
    const response = await submitOrder(payload);
    showSuccess(response.order_id || payload.order_id, payload.total_vera_points, false);
  } catch (error) {
    console.error("Order submission failed; using demo fallback.", error);
    showToast("Backend'e ulasilamadi. Demo siparisi olusturuldu; kayit backend'e gonderilemedi.");
    showSuccess(payload.order_id, payload.total_vera_points, true);
  } finally {
    elements.btnPlaceOrder.disabled = false;
    buttonLabel.textContent = "Siparişi Onayla";
    state.cart = [];
    state.selectedGreenOptionIds.clear();
    renderCart();
  }
}

async function submitOrder(payload) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}${errorText ? ` - ${errorText}` : ""}`);
  }

  return response.json().catch(() => ({}));
}

function buildOrderPayload() {
  const orderId = `DEMO-${Date.now()}`;
  const selectedGreenOptions = getSelectedGreenOptions();
  const { subtotal, totalVeraPoints } = getCartTotals();

  const payload = {
    event: "green_options_selected",
    source: "demo-marketplace",
    brand_id: "DEMO",
    order_id: orderId,
    customer: {
      name: elements.fName.value.trim(),
      email: elements.fEmail.value.trim(),
      address: elements.fAddress.value.trim(),
    },
    items: state.cart.map((item) => ({
      product_id: item.id,
      product_name: item.name,
      brand: item.brand,
      seller: item.seller,
      sector: item.sector,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    })),
    sectors: [...new Set(state.cart.map((item) => item.sector))],
    green_options: selectedGreenOptions.map((option) => ({
      id: option.id,
      name: option.name,
      sector: option.sector,
      vera_points: option.vera_points,
      extra_price: 0,
    })),
    total_products: subtotal,
    total_green: 0,
    grand_total: subtotal,
    total_vera_points: totalVeraPoints,
    timestamp: new Date().toISOString(),
  };

  payload.leafpay_payload = build_leafpay_payload(payload);
  return payload;
}

function build_leafpay_payload(orderPayload) {
  return {
    event: orderPayload.event,
    source: "MorPazar",
    order_id: orderPayload.order_id,
    brand_id: orderPayload.brand_id,
    sectors: orderPayload.sectors,
    green_options: orderPayload.green_options,
    total_products: orderPayload.total_products,
    total_green: orderPayload.total_green,
    grand_total: orderPayload.grand_total,
    total_vera_points: orderPayload.total_vera_points,
    customer: orderPayload.customer,
    timestamp: orderPayload.timestamp,
  };
}

function showSuccess(orderId, veraPoints, isDemo) {
  elements.successOrderId.textContent = isDemo
    ? `Demo modda sipariş oluşturuldu. Sipariş no: ${orderId}`
    : `Sipariş başarıyla iletildi. Sipariş no: ${orderId}`;
  elements.successVeraText.textContent = `${veraPoints} VERA puanı kazandınız.`;
  showView("success");
}

function getEligibleGreenOptionGroups() {
  const sectorsInCart = [...new Set(state.cart.map((item) => item.sector))];
  const groups = sectorsInCart.map((sector) => ({
    title: sector,
    subtitle: `${sector} ürünleri için önerilen yeşil seçenekler`,
    options: greenOptionsBySector[sector].map((option) => ({
      ...option,
      sector,
      groupLabel: sector,
    })),
  }));

  groups.push({
    title: "Evrensel Seçenekler",
    subtitle: "Tüm siparişe uygulanabilen ortak tercihler",
    options: universalGreenOptions.map((option) => ({
      ...option,
      sector: "Evrensel",
      groupLabel: "Tüm sektörler",
    })),
  });

  return groups;
}

function getSelectedGreenOptions() {
  return getEligibleGreenOptionGroups()
    .flatMap((group) => group.options)
    .filter((option) => state.selectedGreenOptionIds.has(option.id));
}

function pruneInvalidGreenSelections() {
  const validOptionIds = new Set(getEligibleGreenOptionGroups().flatMap((group) => group.options.map((option) => option.id)));
  state.selectedGreenOptionIds.forEach((id) => {
    if (!validOptionIds.has(id)) {
      state.selectedGreenOptionIds.delete(id);
    }
  });
}

function getCartTotals() {
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedGreenOptions = getSelectedGreenOptions();
  const totalVeraPoints = selectedGreenOptions.reduce((sum, option) => sum + option.vera_points, 0);
  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    subtotal,
    grandTotal: subtotal,
    totalVeraPoints,
    totalCount,
  };
}

function updateSectionTitle() {
  elements.sectionTitle.textContent = state.selectedSector === "all" ? "Tüm Ürünler" : state.selectedSector;
}

function setActiveSectorButton(sector) {
  document.querySelectorAll(".nav-sector").forEach((button) => {
    button.classList.toggle("active", button.dataset.sector === sector);
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

let toastTimer;
function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2600);
}
