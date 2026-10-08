// =====================================================================
//  SHOP ENGINE  —  Master, you shouldn't need to edit this file.
//  Settings live in config.js and products live in products.js.
// =====================================================================

(function () {
  const CFG = window.SHOP_CONFIG;
  const PRODUCTS = window.PRODUCTS;
  const CART_KEY = "pickledsticker-cart";
  const $ = (id) => document.getElementById(id);

  // ---------- money helpers (work in cents so totals always add up) ----------
  const toCents = (dollars) => Math.round(Number(dollars) * 100);
  const fmt = (cents) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: CFG.currency }).format(cents / 100);
  const toValue = (cents) => (cents / 100).toFixed(2);

  const productById = (id) => PRODUCTS.find((p) => p.id === id);

  // ---------- cart storage ----------
  // Each line: { id, qty, note }. Prices are always looked up fresh from products.js.
  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return raw.filter((l) => productById(l.id) && productById(l.id).inStock && l.qty > 0);
    } catch (e) {
      return [];
    }
  }
  let cart = loadCart();
  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
    renderCart();
  }

  function addToCart(id, note) {
    note = (note || "").trim().slice(0, 100);
    const existing = cart.find((l) => l.id === id && l.note === note);
    if (existing) existing.qty += 1;
    else cart.push({ id, qty: 1, note });
    saveCart();
    toast("Added to cart");
  }

  function totals() {
    const itemsCents = cart.reduce((sum, l) => sum + toCents(productById(l.id).price) * l.qty, 0);
    const freeOver = toCents(CFG.freeShippingOver || 0);
    let shipCents = cart.length ? toCents(CFG.flatShipping || 0) : 0;
    if (freeOver > 0 && itemsCents >= freeOver) shipCents = 0;
    return { itemsCents, shipCents, totalCents: itemsCents + shipCents };
  }

  // ---------- page text from config ----------
  function fillShopText() {
    document.querySelectorAll("[data-shop-name]").forEach((el) => (el.textContent = CFG.shopName));
    $("tagline").textContent = CFG.tagline;
    $("year").textContent = new Date().getFullYear();

    const ship = [`Shipping is a flat ${fmt(toCents(CFG.flatShipping))} per order.`];
    if (CFG.freeShippingOver > 0) ship.push(`Free shipping on orders of ${fmt(toCents(CFG.freeShippingOver))} or more.`);
    $("shippingPolicy").textContent = ship.join(" ");

    const emailSet = CFG.contactEmail && !CFG.contactEmail.startsWith("PASTE_");
    const contact = $("contactLink");
    if (emailSet) {
      contact.href = "mailto:" + CFG.contactEmail;
      contact.textContent = "Email " + CFG.contactEmail;
    } else {
      contact.removeAttribute("href");
      contact.textContent = "Email address coming soon";
    }

    const social = [];
    if (CFG.instagram) social.push(`<a href="${CFG.instagram}" target="_blank" rel="noopener">Instagram</a>`);
    if (CFG.facebook) social.push(`<a href="${CFG.facebook}" target="_blank" rel="noopener">Facebook</a>`);
    $("socialLinks").innerHTML = social.join(" · ");
  }

  // ---------- product grid ----------
  function renderProducts() {
    const grid = $("productGrid");
    grid.innerHTML = "";
    PRODUCTS.forEach((p) => {
      const card = document.createElement("article");
      card.className = "product";
      card.innerHTML = `
        <img src="${p.image}" alt="${escapeHtml(p.name)} tumbler" loading="lazy">
        <div class="product-body">
          <h3>${escapeHtml(p.name)}</h3>
          <p class="meta">${escapeHtml(p.size || "")}</p>
          <p class="desc">${escapeHtml(p.description || "")}</p>
          ${p.personalize && p.inStock ? `<input type="text" maxlength="100" placeholder="Name or text to add (optional)" aria-label="Personalization for ${escapeHtml(p.name)}">` : ""}
          <div class="price">${fmt(toCents(p.price))}</div>
          ${p.inStock
            ? `<button class="btn btn-primary">Add to cart</button>`
            : `<span class="sold-out">Sold out</span>`}
        </div>`;
      const btn = card.querySelector("button");
      if (btn) {
        btn.addEventListener("click", () => {
          const input = card.querySelector("input");
          addToCart(p.id, input ? input.value : "");
          if (input) input.value = "";
        });
      }
      grid.appendChild(card);
    });
  }

  // ---------- cart drawer ----------
  function renderCart() {
    $("cartCount").textContent = cart.reduce((n, l) => n + l.qty, 0);
    const box = $("cartItems");
    if (!cart.length) {
      box.innerHTML = `<p class="empty">Your cart is empty. Go pick a tumbler! 🥒</p>`;
      $("cartTotals").innerHTML = "";
      $("paypal-button-container").style.display = "none";
      return;
    }
    $("paypal-button-container").style.display = "";
    box.innerHTML = "";
    cart.forEach((l, i) => {
      const p = productById(l.id);
      const row = document.createElement("div");
      row.className = "cart-line";
      row.innerHTML = `
        <img src="${p.image}" alt="">
        <div>
          <div class="name">${escapeHtml(p.name)}</div>
          ${l.note ? `<div class="note">Personalization: “${escapeHtml(l.note)}”</div>` : ""}
          <div class="qty">
            <button aria-label="Fewer">−</button><span>${l.qty}</span><button aria-label="More">+</button>
            <button class="remove">Remove</button>
          </div>
        </div>
        <div>${fmt(toCents(p.price) * l.qty)}</div>`;
      const [minus, plus, remove] = row.querySelectorAll("button");
      minus.onclick = () => { l.qty -= 1; if (l.qty <= 0) cart.splice(i, 1); saveCart(); };
      plus.onclick = () => { l.qty += 1; saveCart(); };
      remove.onclick = () => { cart.splice(i, 1); saveCart(); };
      box.appendChild(row);
    });
    const t = totals();
    $("cartTotals").innerHTML = `
      <div class="row"><span>Subtotal</span><span>${fmt(t.itemsCents)}</span></div>
      <div class="row"><span>Shipping</span><span>${t.shipCents ? fmt(t.shipCents) : "Free"}</span></div>
      <div class="row total"><span>Total</span><span>${fmt(t.totalCents)}</span></div>`;
  }

  function openCart() { $("overlay").hidden = false; $("cartDrawer").hidden = false; }
  function closeCart() { $("overlay").hidden = true; $("cartDrawer").hidden = true; }

  // ---------- PayPal ----------
  function showNotice(msg) { const n = $("checkoutNotice"); n.textContent = msg; n.hidden = !msg; }

  function loadPayPal() {
    if (!CFG.paypalClientId || CFG.paypalClientId.startsWith("PASTE_")) {
      showNotice("Checkout isn't switched on yet. The shop owner still needs to add their PayPal Client ID in config.js.");
      return;
    }
    const s = document.createElement("script");
    s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(CFG.paypalClientId)}&currency=${CFG.currency}&intent=capture`;
    s.onload = renderPayPalButtons;
    s.onerror = () => showNotice("Couldn't load PayPal. Please refresh the page or try again in a minute.");
    document.head.appendChild(s);
  }

  function buildOrder() {
    const t = totals();
    const items = cart.map((l) => {
      const p = productById(l.id);
      const item = {
        name: p.name.slice(0, 127),
        sku: p.id.slice(0, 127),
        quantity: String(l.qty),
        unit_amount: { currency_code: CFG.currency, value: toValue(toCents(p.price)) },
        category: "PHYSICAL_GOODS",
      };
      if (l.note) item.description = ("Personalization: " + l.note).slice(0, 127);
      return item;
    });
    return {
      intent: "CAPTURE",
      purchase_units: [{
        description: (CFG.shopName + " order").slice(0, 127),
        amount: {
          currency_code: CFG.currency,
          value: toValue(t.totalCents),
          breakdown: {
            item_total: { currency_code: CFG.currency, value: toValue(t.itemsCents) },
            shipping: { currency_code: CFG.currency, value: toValue(t.shipCents) },
          },
        },
        items,
      }],
    };
  }

  function renderPayPalButtons() {
    window.paypal.Buttons({
      style: { layout: "vertical", color: "gold", shape: "pill", label: "checkout" },
      createOrder: (data, actions) => {
        if (!cart.length) throw new Error("Cart is empty");
        return actions.order.create(buildOrder());
      },
      onApprove: (data, actions) =>
        actions.order.capture().then((details) => {
          cart = [];
          saveCart();
          closeCart();
          $("orderId").textContent = details.id || data.orderID;
          $("thanksModal").hidden = false;
        }),
      onCancel: () => toast("Checkout cancelled. Your cart is still saved."),
      onError: (err) => {
        console.error(err);
        showNotice("Something went wrong with PayPal. Your card was not charged. Please try again.");
      },
    }).render("#paypal-button-container");
  }

  // ---------- little helpers ----------
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  let toastTimer;
  function toast(msg) {
    let el = document.querySelector(".toast");
    if (!el) { el = document.createElement("div"); el.className = "toast"; document.body.appendChild(el); }
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (el.hidden = true), 1800);
  }

  // ---------- start ----------
  fillShopText();
  renderProducts();
  renderCart();
  $("cartButton").onclick = openCart;
  $("closeCart").onclick = closeCart;
  $("overlay").onclick = closeCart;
  $("closeThanks").onclick = () => ($("thanksModal").hidden = true);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });
  loadPayPal();
})();
