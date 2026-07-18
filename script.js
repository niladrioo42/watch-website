/**
 * NEXUS WATCH STUDIO — APPLICATION LOGIC
 * ------------------------------------------------------------
 * Sections:
 *   1. Storage helpers (safe localStorage wrapper)
 *   2. State
 *   3. SVG watch-face renderer (fallback for products with no photo)
 *   3b. watchMediaHTML — prefers real product photos, falls back to SVG
 *   4. Card / list templates
 *   5. Render pipeline (filter -> sort -> paint)
 *   6. Product modal
 *   7. Favorites
 *   8. Compare
 *   9. Search
 *   10. Settings panel
 *   11. Nav / side-panel plumbing
 *   12. Hero live watch + misc UI (toasts, ripple, newsletter)
 *   13. Init
 *
 * Everything here reads from window.NEXUS_WATCHES (data.js) and
 * never mutates it — future backend integration can replace the
 * fetch of that array with an async API call with minimal changes
 * (see fetchCatalog() near the bottom).
 */

/* ================= 1. STORAGE HELPERS ================= */
const Store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* storage unavailable (private mode / disabled) — fail silently */
    }
  }
};

/* ================= 2. STATE ================= */
const State = {
  catalog: [],
  favorites: new Set(Store.get("nx_favorites", [])),
  compare: new Set(Store.get("nx_compare", [])),
  settings: Store.get("nx_settings", {
    theme: "dark",
    accent: "steel",
    cardStyle: "framed",
    gridView: "grid",
    motion: "full"
  }),
  filters: {
    category: "all",
    query: "",
    priceMax: 3200,
    minRating: 0,
    special: "none",
    sort: "best-selling"
  }
};

/* ================= 3. SVG WATCH-FACE RENDERER =================
   Fallback only — used when a product has no `image` field.
   Renders a vector dial using its own `dial` color tokens from
   data.js, so the catalog never shows a broken image icon.
------------------------------------------------------------- */
function watchMediaHTML(watch, size = 200) {
  if (watch.image) {
    return `<img src="${watch.image}" alt="${watch.brand} ${watch.model}" loading="lazy" width="${size}" height="${size}">`;
  }
  return renderWatchSVG(watch, size);
}

function renderWatchSVG(watch, size = 200) {
  const { face, hands, marker, accent } = watch.dial;
  const marks = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    const x1 = 100 + Math.sin(angle) * 82;
    const y1 = 100 - Math.cos(angle) * 82;
    const x2 = 100 + Math.sin(angle) * (i % 3 === 0 ? 70 : 75);
    const y2 = 100 - Math.cos(angle) * (i % 3 === 0 ? 70 : 75);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${marker}" stroke-width="${i % 3 === 0 ? 2.4 : 1.3}" stroke-linecap="round" opacity="${i % 3 === 0 ? 1 : 0.55}"/>`;
  }).join("");

  return `
  <svg viewBox="0 0 200 200" role="img" aria-label="${watch.brand} ${watch.model} dial">
    <circle cx="100" cy="100" r="94" fill="${face}" stroke="${accent}" stroke-width="2.5"/>
    <circle cx="100" cy="100" r="80" fill="none" stroke="${marker}" stroke-width="0.6" opacity="0.35"/>
    ${marks}
    <line x1="100" y1="100" x2="100" y2="64" stroke="${hands}" stroke-width="4" stroke-linecap="round"/>
    <line x1="100" y1="100" x2="128" y2="100" stroke="${hands}" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="100" cy="100" r="4" fill="${accent}"/>
  </svg>`;
}

/* ================= 4. TEMPLATES ================= */
function priceFmt(n) {
  return `$${n.toLocaleString("en-US")}`;
}

function watchCardHTML(w) {
  const discount = w.originalPrice > w.price
    ? Math.round(((w.originalPrice - w.price) / w.originalPrice) * 100)
    : 0;
  const isFav = State.favorites.has(w.id);
  const isCompared = State.compare.has(w.id);
  const stockLabel = w.stock <= 6 ? `Only ${w.stock} left` : "In stock";

  return `
  <article class="watch-card" data-id="${w.id}">
    <div class="card-media">
      <div class="card-badges">
        ${w.isNew ? '<span class="badge badge-new">New</span>' : ""}
        ${discount > 0 ? `<span class="badge badge-sale">-${discount}%</span>` : ""}
        ${w.isBestSeller ? '<span class="badge badge-best">Best seller</span>' : ""}
      </div>
      <button class="card-fav ${isFav ? "is-active" : ""}" data-action="toggle-fav" data-id="${w.id}" aria-label="Save ${w.model}" aria-pressed="${isFav}">
        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 20.2s-7.6-4.6-9.9-9.3C.6 7.1 2.6 3.6 6.2 3.2c2-.2 3.9.8 5.1 2.6a5.9 5.9 0 0 1 4.9-2.6c3.6.4 5.6 3.9 4.1 7.7-2.3 4.7-9.9 9.3-9.9 9.3z" fill="${isFav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
      </button>
      ${watchMediaHTML(w)}
    </div>
    <div class="card-body">
      <span class="card-brand">${w.brand}</span>
      <h3 class="card-model">${w.model}</h3>
      <p class="card-desc">${w.shortDescription}</p>
      <div class="card-meta">
        <span class="card-rating">★ ${w.rating.toFixed(1)}</span>
        <span>(${w.reviewCount})</span>
        <span aria-hidden="true">·</span>
        <span class="card-stock ${w.stock <= 6 ? "low" : ""}">${stockLabel}</span>
      </div>
      <div class="card-price-row">
        <span class="card-price">${priceFmt(w.price)}</span>
        ${discount > 0 ? `<span class="card-price-og">${priceFmt(w.originalPrice)}</span>` : ""}
      </div>
      <div class="card-actions">
        <button class="btn btn-primary ripple" data-action="view" data-id="${w.id}">View details</button>
        <button class="card-compare-btn ripple ${isCompared ? "is-active" : ""}" data-action="toggle-compare" data-id="${w.id}" aria-label="Add ${w.model} to compare" aria-pressed="${isCompared}">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 6h16M4 12h10M4 18h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>
  </article>`;
}

function skeletonCardHTML() {
  return `
  <div class="watch-card" aria-hidden="true">
    <div class="card-media skeleton" style="aspect-ratio:1/1;"></div>
    <div class="card-body">
      <div class="skeleton" style="width:40%;height:10px;margin-bottom:8px;"></div>
      <div class="skeleton" style="width:70%;height:16px;margin-bottom:8px;"></div>
      <div class="skeleton" style="width:90%;height:10px;margin-bottom:14px;"></div>
      <div class="skeleton" style="width:50%;height:20px;"></div>
    </div>
  </div>`;
}

/* ================= 5. RENDER PIPELINE ================= */
function getFilteredSorted() {
  const f = State.filters;
  let list = State.catalog.filter((w) => {
    if (f.category !== "all" && w.category !== f.category) return false;
    if (w.price > f.priceMax) return false;
    if (w.rating < f.minRating) return false;
    if (f.special === "new" && !w.isNew) return false;
    if (f.special === "bestseller" && !w.isBestSeller) return false;
    if (f.special === "discount" && w.originalPrice <= w.price) return false;
    if (f.query) {
      const q = f.query.toLowerCase();
      const haystack = `${w.brand} ${w.model} ${w.category} ${w.tags.join(" ")} ${w.features.join(" ")}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  switch (f.sort) {
    case "newest": list = list.slice().sort((a, b) => (b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1)); break;
    case "price-asc": list = list.slice().sort((a, b) => a.price - b.price); break;
    case "price-desc": list = list.slice().sort((a, b) => b.price - a.price); break;
    case "rating": list = list.slice().sort((a, b) => b.rating - a.rating); break;
    default: list = list.slice().sort((a, b) => (b.isBestSeller === a.isBestSeller ? b.reviewCount - a.reviewCount : b.isBestSeller ? 1 : -1));
  }
  return list;
}

function renderGrid() {
  const grid = document.getElementById("watchGrid");
  const empty = document.getElementById("emptyState");
  const count = document.getElementById("resultCount");
  const list = getFilteredSorted();

  count.textContent = `${list.length} watch${list.length === 1 ? "" : "es"}`;
  grid.classList.toggle("is-list", State.settings.gridView === "list");

  if (!list.length) {
    grid.innerHTML = "";
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  grid.innerHTML = list.map(watchCardHTML).join("");
  requestAnimationFrame(() => initScrollReveal(".watch-card"));
}

function renderRail(containerId, items) {
  const rail = document.getElementById(containerId);
  rail.innerHTML = items.map(watchCardHTML).join("");
  requestAnimationFrame(() => initScrollReveal(".watch-card"));
}

function renderCategoryGrid() {
  const cats = [
    { id: "luxury", label: "Luxury", note: "Automatic, gold-toned" },
    { id: "sport", label: "Sport", note: "GMT, field, titanium" },
    { id: "minimalist", label: "Minimalist", note: "Clean dial, everyday" },
    { id: "diver", label: "Diver", note: "ISO rated, 300m+" },
    { id: "chronograph", label: "Chronograph", note: "Racing, tachymeter" }
  ];
  const grid = document.getElementById("categoryGrid");
  grid.innerHTML = cats.map((c) => `
    <button class="category-tile" data-goto-category="${c.id}">
      <span class="category-tile-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
      </span>
      <h3>${c.label}</h3>
      <span>${c.note}</span>
    </button>`).join("");
  requestAnimationFrame(() => initScrollReveal(".category-tile"));
}

function updateStatModels() {
  const el = document.getElementById("statModels");
  if (el) el.textContent = State.catalog.length;
}
/* ================= 5b. SCROLL REVEAL =================
   Staggers a fade/rise-in as elements enter the viewport.
   Safe no-op fallback if IntersectionObserver is unsupported.
------------------------------------------------------------- */
function initScrollReveal(selector) {
  const els = document.querySelectorAll(`${selector}:not(.in-view)`);
  if (!els.length) return;

  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const i = Array.prototype.indexOf.call(els, entry.target);
      entry.target.style.transitionDelay = `${(i % 4) * 70}ms`;
      entry.target.classList.add("in-view");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  els.forEach((el) => io.observe(el));
}
/* ================= 6. PRODUCT MODAL ================= */
function specRow(label, value) {
  return `<tr><th>${label}</th><td>${value}</td></tr>`;
}

function openProductModal(id) {
  const w = State.catalog.find((x) => x.id === id);
  if (!w) return;
  const modal = document.getElementById("productModal");
  const body = document.getElementById("modalBody");
  const discount = w.originalPrice > w.price ? Math.round(((w.originalPrice - w.price) / w.originalPrice) * 100) : 0;
  const isFav = State.favorites.has(w.id);
  const isCompared = State.compare.has(w.id);

  body.innerHTML = `
    <div class="modal-grid">
      <div>
        <div class="modal-gallery-main" id="modalGalleryMain">${watchMediaHTML(w)}
          <span class="modal-gallery-hint">
            <svg viewBox="0 0 24 24" width="13" height="13"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/><line x1="16.2" y1="16.2" x2="21" y2="21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="11" y1="8.5" x2="11" y2="13.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><line x1="8.5" y1="11" x2="13.5" y2="11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
            Tap to zoom
          </span>
        </div>
        <div class="modal-gallery-thumbs">
          ${[0, 1, 2].map((i) => `<button class="${i === 0 ? "is-active" : ""}" data-thumb="${i}">${watchMediaHTML(w, 60)}</button>`).join("")}
        </div>
      </div>
      <div class="modal-info">
        <span class="modal-info-brand">${w.brand} · ${w.category}</span>
        <h2 id="modalTitle">${w.model}</h2>
        <div class="modal-price-row">
          <span class="modal-price">${priceFmt(w.price)}</span>
          ${discount > 0 ? `<span class="modal-price-og">${priceFmt(w.originalPrice)}</span><span class="badge badge-sale">-${discount}%</span>` : ""}
        </div>
        <p class="modal-desc">${w.description}</p>
        <div class="modal-actions">
          <button class="btn btn-primary ripple" data-action="buy" data-id="${w.id}">Buy — ${priceFmt(w.price)}</button>
          <button class="icon-btn ripple ${isFav ? "is-active" : ""}" data-action="toggle-fav" data-id="${w.id}" aria-label="Save" aria-pressed="${isFav}">
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 20.2s-7.6-4.6-9.9-9.3C.6 7.1 2.6 3.6 6.2 3.2c2-.2 3.9.8 5.1 2.6a5.9 5.9 0 0 1 4.9-2.6c3.6.4 5.6 3.9 4.1 7.7-2.3 4.7-9.9 9.3-9.9 9.3z" fill="${isFav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.6"/></svg>
          </button>
          <button class="icon-btn ripple ${isCompared ? "is-active" : ""}" data-action="toggle-compare" data-id="${w.id}" aria-label="Compare" aria-pressed="${isCompared}">
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M4 6h16M4 12h10M4 18h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
          <button class="icon-btn ripple" data-action="share" data-id="${w.id}" aria-label="Share">
            <svg viewBox="0 0 24 24" width="18" height="18"><circle cx="6" cy="12" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="6" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="18" r="2.4" fill="none" stroke="currentColor" stroke-width="1.6"/><line x1="8.1" y1="10.9" x2="15" y2="7.1" stroke="currentColor" stroke-width="1.4"/><line x1="8.1" y1="13.1" x2="15" y2="16.9" stroke="currentColor" stroke-width="1.4"/></svg>
          </button>
        </div>

        <p class="modal-section-title">Specifications</p>
        <table class="spec-table">
          ${specRow("Movement", w.specs.movement)}
          ${specRow("Case size", w.specs.caseSize)}
          ${specRow("Case material", w.specs.caseMaterial)}
          ${specRow("Glass", w.specs.glassType)}
          ${specRow("Water resistance", w.specs.waterResistance)}
          ${specRow("Strap", w.specs.strapMaterial)}
          ${specRow("Weight", w.specs.weight)}
          ${specRow("Warranty", w.specs.warranty)}
        </table>

        <p class="modal-section-title">Features</p>
        <ul class="feature-list">
          ${w.features.map((f) => `<li>${f}</li>`).join("")}
        </ul>
      </div>
    </div>`;

  modal.hidden = false;
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => document.getElementById("modalClose").focus());
}

function closeProductModal() {
  document.getElementById("productModal").hidden = true;
  document.body.style.overflow = "";
}

/* ================= 7. FAVORITES ================= */
function toggleFavorite(id) {
  if (State.favorites.has(id)) State.favorites.delete(id);
  else State.favorites.add(id);
  Store.set("nx_favorites", [...State.favorites]);
  syncBadges();
  renderGrid();
  renderFavPanel();
  refreshOpenModal(id);
  refreshRails();
  const w = State.catalog.find((x) => x.id === id);
  if (w) showToast(State.favorites.has(id) ? `Saved ${w.model}` : `Removed ${w.model}`);
}

function renderFavPanel() {
  const body = document.getElementById("favBody");
  const items = State.catalog.filter((w) => State.favorites.has(w.id));
  if (!items.length) {
    body.innerHTML = `<p class="empty-note">Nothing saved yet. Tap the heart on any watch to keep it here.</p>`;
    return;
  }
  body.innerHTML = items.map((w) => `
    <div class="mini-row">
      ${watchMediaHTML(w, 40)}
      <div class="mr-info">
        <strong>${w.brand} ${w.model}</strong>
        <span>${priceFmt(w.price)}</span>
      </div>
      <button class="icon-btn mr-remove" data-action="toggle-fav" data-id="${w.id}" aria-label="Remove ${w.model}">
        <svg viewBox="0 0 24 24" width="16" height="16"><line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </button>
    </div>`).join("");
}

/* ================= 8. COMPARE ================= */
function toggleCompare(id) {
  if (State.compare.has(id)) {
    State.compare.delete(id);
  } else {
    if (State.compare.size >= 3) {
      showToast("Compare up to 3 watches at a time");
      return;
    }
    State.compare.add(id);
  }
  Store.set("nx_compare", [...State.compare]);
  syncBadges();
  renderGrid();
  renderComparePanel();
  refreshOpenModal(id);
  refreshRails();
}

function renderComparePanel() {
  const body = document.getElementById("compareBody");
  const countEl = document.getElementById("compareCount");
  const items = State.catalog.filter((w) => State.compare.has(w.id));
  countEl.textContent = `(${items.length})`;

  if (!items.length) {
    body.innerHTML = `<p class="empty-note">Add up to 3 watches to compare specs side by side.</p>`;
    return;
  }

  const rows = [
    ["Price", (w) => priceFmt(w.price)],
    ["Category", (w) => w.category],
    ["Movement", (w) => w.specs.movement],
    ["Case size", (w) => w.specs.caseSize],
    ["Water resistance", (w) => w.specs.waterResistance],
    ["Rating", (w) => `★ ${w.rating.toFixed(1)} (${w.reviewCount})`]
  ];

  const list = items.map((w) => `
    <div class="compare-item">
      ${watchMediaHTML(w, 44)}
      <div class="ci-info"><strong>${w.brand} ${w.model}</strong><span>${priceFmt(w.price)}</span></div>
      <button class="icon-btn mr-remove" data-action="toggle-compare" data-id="${w.id}" aria-label="Remove ${w.model}">
        <svg viewBox="0 0 24 24" width="16" height="16"><line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </button>
    </div>`).join("");

  const table = `
    <table class="compare-spec-table">
      ${rows.map(([label, fn]) => `<tr><th>${label}</th>${items.map((w) => `<td>${fn(w)}</td>`).join("")}</tr>`).join("")}
    </table>`;

  body.innerHTML = list + table;
}

function syncBadges() {
  const favBadge = document.getElementById("favBadge");
  const compareBadge = document.getElementById("compareBadge");
  favBadge.hidden = State.favorites.size === 0;
  favBadge.textContent = State.favorites.size;
  compareBadge.hidden = State.compare.size === 0;
  compareBadge.textContent = State.compare.size;
}

function refreshOpenModal(id) {
  const modal = document.getElementById("productModal");
  if (!modal.hidden && modal.querySelector(`[data-id="${id}"]`)) openProductModal(id);
}

function refreshRails() {
  renderRail("featuredRail", State.catalog.filter((w) => w.isBestSeller));
  renderRail("newRail", State.catalog.filter((w) => w.isNew));
}

/* ================= 9. SEARCH ================= */
function runSearch(query) {
  const results = document.getElementById("searchResults");
  if (!query.trim()) {
    results.innerHTML = "";
    return;
  }
  const q = query.toLowerCase();
  const matches = State.catalog.filter((w) =>
    `${w.brand} ${w.model} ${w.category} ${w.tags.join(" ")} ${w.features.join(" ")} ${w.price}`
      .toLowerCase()
      .includes(q)
  ).slice(0, 8);

  if (!matches.length) {
    results.innerHTML = `<p class="empty-note">No watches match "${query}".</p>`;
    return;
  }

  results.innerHTML = matches.map((w) => `
    <button class="mini-row" data-action="view" data-id="${w.id}" style="width:100%;text-align:left;">
      ${watchMediaHTML(w, 40)}
      <div class="mr-info">
        <strong>${w.brand} ${w.model}</strong>
        <span>${w.category} · ${priceFmt(w.price)}</span>
      </div>
    </button>`).join("");
}

/* ================= 10. SETTINGS ================= */
function applySettings() {
  const s = State.settings;
  document.body.dataset.theme = s.theme === "auto"
    ? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
    : s.theme;
  document.body.dataset.accent = s.accent;
  document.body.dataset.cardStyle = s.cardStyle;
  document.body.dataset.motion = s.motion;

  document.querySelectorAll("[data-setting]").forEach((group) => {
    const key = group.dataset.setting;
    group.querySelectorAll("[data-value]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.value === s[key]);
    });
  });
}

function updateSetting(key, value) {
  State.settings[key] = value;
  Store.set("nx_settings", State.settings);
  applySettings();
  if (key === "gridView") renderGrid();
}

/* ================= 11. NAV / PANEL PLUMBING ================= */
function openPanel(panel) {
  document.querySelectorAll(".side-panel.is-open").forEach((p) => p.classList.remove("is-open"));
  panel.hidden = false;
  requestAnimationFrame(() => panel.classList.add("is-open"));
  document.getElementById("scrim").hidden = false;
  requestAnimationFrame(() => document.getElementById("scrim").classList.add("is-visible"));
}
function closeAllPanels() {
  document.querySelectorAll(".side-panel").forEach((p) => {
    p.classList.remove("is-open");
    setTimeout(() => { p.hidden = true; }, 350);
  });
  const scrim = document.getElementById("scrim");
  scrim.classList.remove("is-visible");
  setTimeout(() => { scrim.hidden = true; }, 350);
}

/* ================= 12. MISC UI ================= */
function showToast(message) {
  const stack = document.getElementById("toastStack");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  stack.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
}

function attachRipple() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".ripple");
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const fx = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    fx.className = "ripple-fx";
    fx.style.width = fx.style.height = `${size}px`;
    fx.style.left = `${e.clientX - rect.left - size / 2}px`;
    fx.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.style.position = btn.style.position || "relative";
    btn.appendChild(fx);
    setTimeout(() => fx.remove(), 650);
  });
}

function updateHeroClock() {
  const now = new Date();
  const h = now.getHours() % 12;
  const m = now.getMinutes();
  const s = now.getSeconds();
  const hourDeg = h * 30 + m * 0.5;
  const minDeg = m * 6 + s * 0.1;
  const secDeg = s * 6;
  const hour = document.getElementById("handHour");
  const minute = document.getElementById("handMinute");
  const second = document.getElementById("handSecond");
  if (hour) hour.style.transform = `rotate(${hourDeg}deg)`;
  if (minute) minute.style.transform = `rotate(${minDeg}deg)`;
  if (second) second.style.transform = `rotate(${secDeg}deg)`;
}

function drawHeroHourMarks() {
  const g = document.getElementById("hourMarks");
  if (!g) return;
  let marks = "";
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 * Math.PI) / 180;
    const r1 = 92, r2 = i % 3 === 0 ? 78 : 84;
    const x1 = 110 + Math.sin(angle) * r1, y1 = 110 - Math.cos(angle) * r1;
    const x2 = 110 + Math.sin(angle) * r2, y2 = 110 - Math.cos(angle) * r2;
    marks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${i % 3 === 0 ? 2.4 : 1.2}"/>`;
  }
  g.innerHTML = marks;
}

/* ================= 13. EVENT DELEGATION ================= */
function attachDelegatedEvents() {
  document.addEventListener("click", (e) => {
    const actionEl = e.target.closest("[data-action]");
    if (actionEl) {
      const { action, id } = actionEl.dataset;
      if (action === "view") openProductModal(id);
      if (action === "toggle-fav") toggleFavorite(id);
      if (action === "toggle-compare") toggleCompare(id);
      if (action === "buy") showToast("Added to cart — checkout coming soon");
      if (action === "share") {
        if (navigator.share) {
          navigator.share({ title: "Nexus Watch Studio", text: "Check out this watch", url: location.href }).catch(() => {});
        } else {
          showToast("Link copied to clipboard");
          navigator.clipboard?.writeText(location.href).catch(() => {});
        }
      }
    }

    const openProduct = e.target.closest("[data-open-product]");
    if (openProduct) { e.preventDefault(); openProductModal(openProduct.dataset.openProduct); }

    const catGoto = e.target.closest("[data-goto-category]");
    if (catGoto) {
      const cat = catGoto.dataset.gotoCategory;
      State.filters.category = cat;
      document.querySelectorAll("[data-filter-category]").forEach((c) => c.classList.toggle("is-active", c.dataset.filterCategory === cat));
      document.getElementById("collection").scrollIntoView({ behavior: "smooth" });
      renderGrid();
    }

    const chip = e.target.closest("[data-filter-category]");
    if (chip) {
      State.filters.category = chip.dataset.filterCategory;
      document.querySelectorAll("[data-filter-category]").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      renderGrid();
    }

    const segBtn = e.target.closest(".segmented button[data-value]");
    if (segBtn && segBtn.closest("[data-setting]")) {
      const group = segBtn.closest("[data-setting]");
      group.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
      segBtn.classList.add("is-active");
      updateSetting(group.dataset.setting, segBtn.dataset.value);
    }
    if (segBtn && segBtn.closest("#ratingFilter")) {
      document.querySelectorAll("#ratingFilter button").forEach((b) => b.classList.remove("is-active"));
      segBtn.classList.add("is-active");
      State.filters.minRating = parseFloat(segBtn.dataset.value);
      renderGrid();
    }
    if (segBtn && segBtn.closest("#specialFilter")) {
      document.querySelectorAll("#specialFilter button").forEach((b) => b.classList.remove("is-active"));
      segBtn.classList.add("is-active");
      State.filters.special = segBtn.dataset.value;
      renderGrid();
    }

    const swatch = e.target.closest(".swatch[data-value]");
    if (swatch) {
      document.querySelectorAll(".swatch").forEach((s) => s.classList.remove("is-active"));
      swatch.classList.add("is-active");
      updateSetting("accent", swatch.dataset.value);
    }

    if (e.target.closest("#clearFilters")) {
      State.filters = { ...State.filters, category: "all", query: "", priceMax: 3200, minRating: 0, special: "none" };
      document.querySelectorAll("[data-filter-category]").forEach((c) => c.classList.toggle("is-active", c.dataset.filterCategory === "all"));
      document.querySelectorAll("#ratingFilter button").forEach((b, i) => b.classList.toggle("is-active", i === 0));
      document.querySelectorAll("#specialFilter button").forEach((b, i) => b.classList.toggle("is-active", i === 0));
      document.getElementById("priceMax").value = 3200;
      document.getElementById("priceMaxOut").textContent = "$3200";
      renderGrid();
    }
  });

  // Modal / panel close controls
  document.getElementById("modalClose").addEventListener("click", closeProductModal);
  document.getElementById("productModal").addEventListener("click", (e) => { if (e.target.id === "productModal") closeProductModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeProductModal(); closeSearch(); closeAllPanels(); } });

  document.getElementById("modalBody").addEventListener("click", (e) => {
    const thumb = e.target.closest("[data-thumb]");
    if (thumb) {
      thumb.parentElement.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
      thumb.classList.add("is-active");
    }

    const gallery = e.target.closest("#modalGalleryMain");
    if (gallery) {
      const isZoomed = gallery.classList.contains("is-zoomed");
      if (!isZoomed) {
        const rect = gallery.getBoundingClientRect();
        const originX = ((e.clientX - rect.left) / rect.width) * 100;
        const originY = ((e.clientY - rect.top) / rect.height) * 100;
        const img = gallery.querySelector("img");
        if (img) img.style.transformOrigin = `${originX}% ${originY}%`;
      }
      gallery.classList.toggle("is-zoomed");
    }
  });

  document.getElementById("scrim").addEventListener("click", closeAllPanels);

  document.getElementById("settingsToggle").addEventListener("click", () => openPanel(document.getElementById("settingsPanel")));
  document.getElementById("settingsClose").addEventListener("click", closeAllPanels);
  document.getElementById("compareToggle").addEventListener("click", () => openPanel(document.getElementById("comparePanel")));
  document.getElementById("compareClose").addEventListener("click", closeAllPanels);
  document.getElementById("favToggle").addEventListener("click", () => openPanel(document.getElementById("favPanel")));
  document.getElementById("favClose").addEventListener("click", closeAllPanels);

  document.getElementById("menuToggle").addEventListener("click", (e) => {
    e.currentTarget.classList.toggle("is-active");
    const open = e.currentTarget.classList.contains("is-active");
    e.currentTarget.setAttribute("aria-expanded", open);
    document.getElementById("mobileSheet").classList.toggle("is-open", open);
  });
  document.querySelectorAll(".mobile-sheet a").forEach((a) => a.addEventListener("click", () => {
    document.getElementById("menuToggle").classList.remove("is-active");
    document.getElementById("mobileSheet").classList.remove("is-open");
  }));

  // Search
  document.getElementById("searchToggle").addEventListener("click", openSearch);
  document.getElementById("searchClose").addEventListener("click", closeSearch);
  document.getElementById("searchOverlay").addEventListener("click", (e) => { if (e.target.id === "searchOverlay") closeSearch(); });
  document.getElementById("searchInput").addEventListener("input", (e) => runSearch(e.target.value));

  // Sort + filter toggle
  document.getElementById("sortSelect").addEventListener("change", (e) => { State.filters.sort = e.target.value; renderGrid(); });
  document.getElementById("filterToggle").addEventListener("click", (e) => {
    const expand = document.getElementById("filterExpand");
    const isHidden = expand.hidden;
    expand.hidden = !isHidden;
    e.currentTarget.classList.toggle("is-active", isHidden);
    e.currentTarget.setAttribute("aria-expanded", isHidden);
  });
  document.getElementById("priceMax").addEventListener("input", (e) => {
    State.filters.priceMax = Number(e.target.value);
    document.getElementById("priceMaxOut").textContent = `$${e.target.value}`;
    renderGrid();
  });

  // Newsletter
  document.getElementById("newsletterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletterEmail").value;
    document.getElementById("newsletterStatus").textContent = `You're on the list — we'll email ${email} when something drops.`;
    e.target.reset();
  });
}

function openSearch() {
  const overlay = document.getElementById("searchOverlay");
  overlay.hidden = false;
  document.getElementById("searchToggle").setAttribute("aria-expanded", "true");
  document.getElementById("searchInput").value = "";
  document.getElementById("searchResults").innerHTML = "";
  requestAnimationFrame(() => document.getElementById("searchInput").focus());
}
function closeSearch() {
  const overlay = document.getElementById("searchOverlay");
  if (overlay.hidden) return;
  overlay.hidden = true;
  document.getElementById("searchToggle").setAttribute("aria-expanded", "false");
}

/* ================= FUTURE-READY DATA FETCH =================
   Swap this for a real API/Firebase/Supabase call later — every
   render function above only needs an array shaped like data.js.
------------------------------------------------------------- */
async function fetchCatalog() {
  // Placeholder for future async source. Currently reads the
  // bundled static module so the site works fully offline.
  return typeof NEXUS_WATCHES !== "undefined" ? NEXUS_WATCHES : [];
}

/* ================= INIT ================= */
async function init() {
  applySettings();
  document.getElementById("footerYear").textContent = new Date().getFullYear();
  drawHeroHourMarks();
  updateHeroClock();
  setInterval(updateHeroClock, 1000);
  attachRipple();
  attachDelegatedEvents();

  // brief skeleton state for perceived performance on slow connections
  document.getElementById("watchGrid").innerHTML = Array.from({ length: 6 }).map(skeletonCardHTML).join("");

  State.catalog = await fetchCatalog();
  updateStatModels();
  renderCategoryGrid();
  refreshRails();
  renderGrid();
  renderFavPanel();
  renderComparePanel();
  syncBadges();
  initScrollReveal(".review-card");

  const loader = document.getElementById("appLoader");
  setTimeout(() => loader.classList.add("is-hidden"), 350);
}

document.addEventListener("DOMContentLoaded", init);
