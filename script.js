let DATA = { info: {}, categories: [], products: [] };
let cart = [];
let sizePick = {};
let activeFilter = "Início";
let searchTerm = "";

const CATEGORY_ICONS = {
  "Roupas": "checkroom",
  "Calçados": "footprint",
  "Acessórios": "diamond",
  "Perfumaria": "spa",
  "Utilidades para o Lar": "home",
};

function currency(n) {
  return (Number(n) || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatPhone(digits) {
  const d = (digits || "").replace(/\D/g, "").replace(/^55/, "");
  if (d.length < 10) return digits || "";
  const ddd = d.slice(0, 2);
  const rest = d.slice(2);
  return rest.length === 9 ? `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}` : `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
}

async function init() {
  try {
    const res = await fetch("data.json", { cache: "no-store" });
    if (!res.ok) throw new Error("failed to load data.json");
    DATA = await res.json();
  } catch (e) {
    showNotice("Não foi possível carregar os produtos agora. Tente recarregar a página.");
    DATA = { info: { name: "Virtuosa Inspiração", tagline: "", whatsapp: "" }, categories: [], products: [] };
  }
  renderHeader();
  renderNavCats();
  renderCatIcons();
  renderChips();
  renderColumns();
  renderCatalog();
  renderFooter();
}

function showNotice(msg) {
  const el = document.getElementById("notice");
  el.textContent = msg;
  el.style.display = "block";
}

function renderHeader() {
  document.getElementById("logoText").textContent = (DATA.info.name || "Loja").toUpperCase();
  document.getElementById("heroTagline").textContent = DATA.info.tagline || "";
  document.getElementById("phoneText").textContent = formatPhone(DATA.info.whatsapp);
  document.title = DATA.info.name || "Loja";
}

function renderNavCats() {
  const el = document.getElementById("navCats");
  const items = ["Início", ...(DATA.categories || []), "Promoções"];
  el.innerHTML = items.map((c) => {
    const cls = ["", activeFilter === c ? "active" : "", c === "Promoções" ? "promo" : ""].join(" ").trim();
    return `<button class="${cls}" onclick="scrollToCatalog('${c.replace(/'/g, "\\'")}')">${c}</button>`;
  }).join("");
}

function renderCatIcons() {
  const el = document.getElementById("catIcons");
  el.style.gridTemplateColumns = `repeat(${Math.min((DATA.categories || []).length, 3)}, 1fr)`;
  el.innerHTML = (DATA.categories || []).map((c) => `
    <button class="cat-icon-card" onclick="scrollToCatalog('${c.replace(/'/g, "\\'")}')">
      <span class="icon">${CATEGORY_ICONS[c] || "sell"}</span>
      <span class="label">${c}</span>
    </button>
  `).join("");
}

function renderChips() {
  const el = document.getElementById("chipRow");
  const items = ["Início", ...(DATA.categories || []), "Promoções"];
  el.innerHTML = items.map((c) => `
    <button class="chip ${activeFilter === c ? "active" : ""}" onclick="setFilter('${c.replace(/'/g, "\\'")}')">${c === "Início" ? "Todos" : c}</button>
  `).join("");
}

function setFilter(c) {
  activeFilter = c;
  renderNavCats();
  renderChips();
  renderCatalog();
}

function scrollToCatalog(filter) {
  if (filter) setFilter(filter);
  document.getElementById("catalogSection").scrollIntoView({ behavior: "smooth", block: "start" });
}

function onSearch(v) {
  searchTerm = v;
  renderCatalog();
}

function getFiltered() {
  return (DATA.products || []).filter((p) => {
    const matchesSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFilter === "Início") return true;
    if (activeFilter === "Promoções") return p.compareAtPrice > p.price;
    return p.category === activeFilter;
  });
}

function productCardHtml(p) {
  const sizeList = p.sizes ? p.sizes.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const hasDiscount = p.compareAtPrice > p.price;
  const pct = hasDiscount ? Math.round((1 - p.price / p.compareAtPrice) * 100) : 0;
  const chosen = sizePick[p.id] || sizeList[0];
  return `
    <div class="card">
      <div class="card-img">
        ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.name}" />` : `<span class="display initial">${(p.name || "?").charAt(0)}</span>`}
        ${hasDiscount ? `<span class="badge">-${pct}%</span>` : ""}
      </div>
      <div class="card-body">
        <p class="name">${p.name}</p>
        <div>
          ${hasDiscount ? `<span class="old">${currency(p.compareAtPrice)}</span>` : ""}
          <p class="price display">${currency(p.price)}</p>
        </div>
        ${sizeList.length ? `<div class="sizes">${sizeList.map((s) => `<button class="size-btn ${chosen === s ? "active" : ""}" onclick="pickSize('${p.id}','${s.replace(/'/g, "\\'")}')">${s}</button>`).join("")}</div>` : ""}
        <button class="add-btn" onclick="addToCart('${p.id}')">ADICIONAR</button>
      </div>
    </div>
  `;
}

function pickSize(id, size) {
  sizePick[id] = size;
  renderCatalog();
  renderColumns();
}

function renderCatalog() {
  const grid = document.getElementById("catalogGrid");
  const items = getFiltered();
  grid.innerHTML = items.length ? items.map(productCardHtml).join("") : `<p class="empty-msg" style="grid-column:1/-1;">Nenhum produto encontrado.</p>`;
}

function miniCardHtml(p) {
  const hasDiscount = p.compareAtPrice > p.price;
  const pct = hasDiscount ? Math.round((1 - p.price / p.compareAtPrice) * 100) : 0;
  return `
    <div class="mini-card">
      <div class="mini-thumb">
        ${p.imageUrl ? `<img src="${p.imageUrl}" alt="" />` : `<span class="display">${(p.name || "?").charAt(0)}</span>`}
      </div>
      <div class="mini-info">
        <p class="name">${p.name}</p>
        ${hasDiscount ? `<span class="mini-old">${currency(p.compareAtPrice)}</span>` : ""}
        <span class="mini-price">${currency(p.price)}</span>
      </div>
      <button class="mini-add" onclick="addToCart('${p.id}')"><span class="icon" style="font-size:16px;">add</span></button>
    </div>
  `;
}

function renderColumns() {
  const products = DATA.products || [];
  const promo = products.filter((p) => p.compareAtPrice > p.price).slice(0, 3);
  const novidade = products.filter((p) => p.novidade).slice(0, 3);
  const maisVendido = products.filter((p) => p.maisVendido).slice(0, 3);

  document.getElementById("colPromo").innerHTML = promo.length ? promo.map(miniCardHtml).join("") : `<p class="col-empty">Nenhum produto em promoção ainda.</p>`;
  document.getElementById("colNovidade").innerHTML = novidade.length ? novidade.map(miniCardHtml).join("") : `<p class="col-empty">Nenhuma novidade marcada ainda.</p>`;
  document.getElementById("colMaisVendido").innerHTML = maisVendido.length ? maisVendido.map(miniCardHtml).join("") : `<p class="col-empty">Nenhum produto marcado ainda.</p>`;
}

function renderFooter() {
  document.getElementById("footerPhone").textContent = formatPhone(DATA.info.whatsapp);
  if (DATA.info.instagram) {
    document.getElementById("footerInstagramText").textContent = DATA.info.instagram;
  } else {
    document.getElementById("footerInstagram").style.display = "none";
  }
  if (DATA.info.email) {
    document.getElementById("footerEmailText").textContent = DATA.info.email;
  } else {
    document.getElementById("footerEmail").style.display = "none";
  }
}

function addToCart(productId) {
  const product = (DATA.products || []).find((p) => p.id === productId);
  if (!product) return;
  const sizeList = product.sizes ? product.sizes.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const size = sizePick[productId] || sizeList[0] || "";
  const idx = cart.findIndex((it) => it.productId === productId && it.size === size);
  if (idx >= 0) cart[idx].qty += 1;
  else cart.push({ productId, name: product.name, price: product.price, size, qty: 1 });
  renderCart();
  openCart();
}

function changeQty(productId, size, delta) {
  const idx = cart.findIndex((it) => it.productId === productId && it.size === size);
  if (idx < 0) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  renderCart();
}

function removeFromCart(productId, size) {
  cart = cart.filter((it) => !(it.productId === productId && it.size === size));
  renderCart();
}

function cartTotal() { return cart.reduce((sum, it) => sum + it.price * it.qty, 0); }
function cartCount() { return cart.reduce((sum, it) => sum + it.qty, 0); }

function renderCart() {
  const count = cartCount();
  const badge = document.getElementById("cartBadge");
  badge.style.display = count > 0 ? "flex" : "none";
  badge.textContent = count;

  const body = document.getElementById("cartBody");
  if (cart.length === 0) {
    body.innerHTML = `<p class="cart-empty">Sua sacola está vazia.</p>`;
  } else {
    body.innerHTML = cart.map((it) => `
      <div class="cart-item">
        <div>
          <p class="name">${it.name}</p>
          ${it.size ? `<p class="size">Tam. ${it.size}</p>` : ""}
          <p class="price">${currency(it.price)}</p>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
          <div class="qty-row">
            <button onclick="changeQty('${it.productId}','${it.size.replace(/'/g, "\\'")}',-1)"><span class="icon" style="font-size:14px;">remove</span></button>
            <span style="font-size:12px;min-width:12px;text-align:center;">${it.qty}</span>
            <button onclick="changeQty('${it.productId}','${it.size.replace(/'/g, "\\'")}',1)"><span class="icon" style="font-size:14px;">add</span></button>
          </div>
          <button class="remove-link" onclick="removeFromCart('${it.productId}','${it.size.replace(/'/g, "\\'")}')">remover</button>
        </div>
      </div>
    `).join("");
  }

  const footer = document.getElementById("cartFooter");
  footer.innerHTML = cart.length > 0 ? `
    <div class="cart-footer">
      <div class="cart-total-row"><span>Total</span><span>${currency(cartTotal())}</span></div>
      <button class="checkout-btn" onclick="checkoutWhatsapp()">FINALIZAR NO WHATSAPP</button>
    </div>
  ` : "";
}

function checkoutWhatsapp() {
  if (cart.length === 0) return;
  const lines = cart.map((it) => `• ${it.qty}x ${it.name}${it.size ? ` (tam. ${it.size})` : ""} — ${currency(it.price * it.qty)}`);
  const text = `Olá! Quero fazer um pedido na ${DATA.info.name}:\n\n` + lines.join("\n") + `\n\nTotal: ${currency(cartTotal())}`;
  const phone = (DATA.info.whatsapp || "").replace(/\D/g, "");
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
}

function openCart() { document.getElementById("cartOverlay").classList.add("open"); }
function closeCart() { document.getElementById("cartOverlay").classList.remove("open"); }

init();
