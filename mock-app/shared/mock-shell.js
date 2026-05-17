/**
 * Mock-store shell:
 *  - membership select (MEMBER / GUEST) drives body[data-membership]
 *  - cart badge synced from localStorage `mock-store-cart`
 *  - toast helper exposed as window.mockStore.toast(message)
 *  - shared drawer toggle, user menu, POM inspector (unchanged in spirit)
 *
 * Expected DOM ids: membership-select, user-menu-btn, user-dropdown,
 * cart-badge, toast-root, collapse-menu-btn, side-nav, app-layout.
 */
(function initMockShell() {
  const CART_KEY = "mock-store-cart";
  const MEMBERSHIP_KEY = "mock-store-membership";

  function safeRead(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeWrite(key, value) {
    try {
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch {
      /* ignore */
    }
  }

  function readCart() {
    try {
      const raw = safeRead(CART_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeCart(items) {
    safeWrite(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("mock-store:cart-changed", { detail: items }));
  }

  function cartCount(items) {
    return (items || readCart()).reduce((n, line) => n + (Number(line.qty) || 0), 0);
  }

  const cart = {
    read: readCart,
    write: writeCart,
    count: () => cartCount(),
    add(item) {
      const items = readCart();
      const existing = items.find((line) => line.slug === item.slug);
      if (existing) {
        existing.qty = (Number(existing.qty) || 0) + (Number(item.qty) || 1);
      } else {
        items.push({
          slug: String(item.slug),
          name: String(item.name),
          price: Number(item.price),
          qty: Number(item.qty) || 1,
        });
      }
      writeCart(items);
    },
    setQty(slug, qty) {
      const items = readCart();
      const line = items.find((l) => l.slug === slug);
      if (!line) return;
      const next = Math.max(0, Number(qty) || 0);
      if (next === 0) {
        writeCart(items.filter((l) => l.slug !== slug));
        return;
      }
      line.qty = next;
      writeCart(items);
    },
    remove(slug) {
      writeCart(readCart().filter((l) => l.slug !== slug));
    },
    clear() {
      writeCart([]);
    },
  };

  function toast(message, opts) {
    const root = document.getElementById("toast-root");
    if (!root) return;
    const node = document.createElement("div");
    node.className = "toast";
    node.setAttribute("role", "status");
    node.textContent = String(message);
    root.appendChild(node);
    const timeout = (opts && opts.timeout) ?? 3000;
    if (timeout > 0) {
      setTimeout(() => {
        if (node.parentNode === root) root.removeChild(node);
      }, timeout);
    }
  }

  const PRODUCT_CATALOG = {
    "acme-widget": { name: "Acme Widget", full: 10, member: 5 },
    "super-gizmo": { name: "Super Gizmo", full: 6, member: 3 },
  };

  function formatPounds(amount) {
    return `£${amount}`;
  }

  function currentMembership() {
    return document.body.getAttribute("data-membership") || "MEMBER";
  }

  function activeUnitPrice(slug) {
    const p = PRODUCT_CATALOG[slug];
    if (!p) return 0;
    return currentMembership() === "MEMBER" ? p.member : p.full;
  }

  function renderPriceHost(host, slug) {
    const p = PRODUCT_CATALOG[slug];
    if (!p || !host) return;
    const full = formatPounds(p.full);
    const member = formatPounds(p.member);
    if (currentMembership() === "MEMBER") {
      host.innerHTML =
        `<span class="price-member-display">` +
        `<span class="price-was"><s>${full}</s></span> ` +
        `<span class="price-now">${member}</span></span>`;
    } else {
      host.textContent = full;
    }
  }

  function syncCatalogPricing() {
    document.querySelectorAll("td.catalog-price-cell[data-product-slug]").forEach((cell) => {
      renderPriceHost(cell, cell.getAttribute("data-product-slug"));
    });
  }

  function syncProductDetailPricing() {
    const main = document.querySelector("main[data-product-slug]");
    if (!main) return;
    const slug = main.getAttribute("data-product-slug");
    const host = main.querySelector(".product-price");
    renderPriceHost(host, slug);
    const addBtn = main.querySelector("#add-to-cart-btn");
    if (addBtn) addBtn.dataset.productPrice = String(activeUnitPrice(slug));
  }

  function syncFeaturedCardPricing() {
    document.querySelectorAll(".featured-card[data-product-slug]").forEach((card) => {
      const slug = card.getAttribute("data-product-slug");
      const host = card.querySelector(".featured-card__price");
      renderPriceHost(host, slug);
    });
  }

  function syncProductPricing() {
    syncCatalogPricing();
    syncProductDetailPricing();
    syncFeaturedCardPricing();
  }

  window.mockStore = {
    cart,
    toast,
    PRODUCT_CATALOG,
    formatPounds,
    activeUnitPrice,
    syncProductPricing,
  };

  const collapseBtn = document.getElementById("collapse-menu-btn");
  const sideNav = document.getElementById("side-nav");
  const layout = document.getElementById("app-layout");
  const drawerChev = document.querySelector("#collapse-menu-btn .drawer-chev");

  function setDrawerUi(collapsed) {
    if (!collapseBtn || !layout) return;
    collapseBtn.setAttribute("aria-expanded", String(!collapsed));
    collapseBtn.setAttribute("aria-label", collapsed ? "Expand menu" : "Collapse menu");
    if (drawerChev) drawerChev.textContent = collapsed ? ">" : "<";
  }

  if (collapseBtn && sideNav && layout) {
    setDrawerUi(layout.classList.contains("nav-collapsed"));
    collapseBtn.addEventListener("click", () => {
      layout.classList.toggle("nav-collapsed");
      setDrawerUi(layout.classList.contains("nav-collapsed"));
    });
  }

  const userBtn = document.getElementById("user-menu-btn");
  const userDrop = document.getElementById("user-dropdown");

  function closeUserMenu() {
    if (!userDrop || !userBtn) return;
    userDrop.hidden = true;
    userBtn.setAttribute("aria-expanded", "false");
  }

  if (userBtn && userDrop) {
    userBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = userDrop.hidden;
      userDrop.hidden = !open;
      userBtn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", () => closeUserMenu());
    userDrop.addEventListener("click", (e) => e.stopPropagation());
  }

  function applyMembershipLocks() {
    const m = document.body.getAttribute("data-membership") || "MEMBER";
    document.querySelectorAll("[data-membership-lock]").forEach((el) => {
      const lockEl = el.parentElement?.querySelector(".membership-lock-icon");
      if (m === "GUEST") {
        el.setAttribute("aria-disabled", "true");
        el.classList.add("nav-link-locked");
        if (el.tagName === "BUTTON" || el.tagName === "INPUT") el.setAttribute("disabled", "");
        if (lockEl) {
          lockEl.hidden = false;
          lockEl.removeAttribute("aria-hidden");
        }
      } else {
        el.removeAttribute("aria-disabled");
        el.classList.remove("nav-link-locked");
        if (el.tagName === "BUTTON" || el.tagName === "INPUT") el.removeAttribute("disabled");
        if (lockEl) {
          lockEl.hidden = true;
          lockEl.setAttribute("aria-hidden", "true");
        }
      }
    });
  }

  function syncUserMenuButtonLabel() {
    const btn = document.getElementById("user-menu-btn");
    if (!btn) return;
    const m = document.body.getAttribute("data-membership") || "MEMBER";
    btn.textContent = m === "GUEST" ? "Guest menu" : "Member menu";
  }

  function syncMembershipGreetings() {
    const m = document.body.getAttribute("data-membership") || "MEMBER";
    document.querySelectorAll("[data-membership-greeting]").forEach((el) => {
      el.textContent = m;
    });
  }

  const membershipSelect = document.getElementById("membership-select");
  if (membershipSelect) {
    const stored = safeRead(MEMBERSHIP_KEY);
    if (stored === "MEMBER" || stored === "GUEST") {
      membershipSelect.value = stored;
    }
    const sync = () => {
      const v = membershipSelect.value;
      document.body.setAttribute("data-membership", v);
      safeWrite(MEMBERSHIP_KEY, v);
      syncUserMenuButtonLabel();
      syncMembershipGreetings();
      applyMembershipLocks();
      syncProductPricing();
    };
    sync();
    membershipSelect.addEventListener("change", sync);
  } else {
    document.body.setAttribute("data-membership", "MEMBER");
    syncUserMenuButtonLabel();
    syncMembershipGreetings();
    applyMembershipLocks();
    syncProductPricing();
  }

  function renderCartBadge() {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;
    const n = cart.count();
    badge.textContent = String(n);
    badge.setAttribute("data-cart-count", String(n));
    badge.classList.toggle("cart-badge--empty", n === 0);
  }

  renderCartBadge();
  window.addEventListener("mock-store:cart-changed", renderCartBadge);
  window.addEventListener("storage", (e) => {
    if (e.key === CART_KEY) renderCartBadge();
  });

  /** POM inspector toggle + outlines + listing widget (unchanged from earlier shell). */
  const POM_VISUAL_KEY = "pw-pom-visual";

  function applyPomOutlineQueryFlag() {
    try {
      const sp = new URLSearchParams(location.search);
      if (sp.get("pom") === "1" || sp.get("pomOutlines") === "1" || sp.get("pomVisual") === "1") {
        localStorage.setItem(POM_VISUAL_KEY, "1");
      }
      if (sp.get("pom") === "0" || sp.get("pomOutlines") === "0") {
        localStorage.removeItem(POM_VISUAL_KEY);
      }
    } catch {
      /* ignore */
    }
  }
  applyPomOutlineQueryFlag();

  const DEFAULT_POM_OUTLINE_CONFIG = {
    tierColors: {
      page: { outline: "#6d28d9", labelBackground: "#4c1d95", labelText: "#f5f3ff" },
      componentOuter: { outline: "#1d4ed8", labelBackground: "#1e3a8a", labelText: "#eff6ff" },
      componentInner: { outline: "#047857", labelBackground: "#064e3b", labelText: "#ecfdf5" },
    },
    dataPomToTier: {
      "components/shell/header": "componentOuter",
      "components/shell/navDrawer": "componentOuter",
      "components/shell/toast": "componentOuter",
      "components/widgets/table": "componentInner",
      "components/widgets/searchBox": "componentInner",
      "components/widgets/modal": "componentInner",
      "components/widgets/quantityStepper": "componentInner",
    "components/widgets/featuredOffers": "componentInner",
    "components/widgets/productCard": "componentInner",
      "pages/store.home": "page",
      "pages/store.catalog": "page",
      "pages/store.product-detail": "page",
      "pages/store.cart": "page",
      "pages/store.checkout": "page",
      "pages/store.order-confirmation": "page",
    },
  };

  function mergePomOutlineConfig(base, over) {
    if (!over || typeof over !== "object") return base;
    const out = { tierColors: {}, dataPomToTier: { ...base.dataPomToTier } };
    for (const k of Object.keys(base.tierColors)) {
      out.tierColors[k] = { ...base.tierColors[k], ...(over.tierColors && over.tierColors[k] ? over.tierColors[k] : {}) };
    }
    if (over.dataPomToTier) Object.assign(out.dataPomToTier, over.dataPomToTier);
    return out;
  }

  let resolvedPomOutlineConfig = DEFAULT_POM_OUTLINE_CONFIG;

  function applyPomTierCssVariables(cfg) {
    const root = document.documentElement;
    ["page", "componentOuter", "componentInner"].forEach((tier) => {
      const spec = (cfg.tierColors && cfg.tierColors[tier]) || {};
      root.style.setProperty(`--pom-tier-${tier}-outline`, spec.outline || "");
      root.style.setProperty(`--pom-tier-${tier}-labelBg`, spec.labelBackground || "");
      root.style.setProperty(`--pom-tier-${tier}-labelFg`, spec.labelText || "");
    });
  }

  function inferPomTier(name, map) {
    if (map[name]) return map[name];
    if (name.startsWith("pages/")) return "page";
    if (name.startsWith("components/shell/")) return "componentOuter";
    if (name.startsWith("components/widgets/")) return "componentInner";
    return "componentInner";
  }

  function applyPomTierAttributes(cfg) {
    const map = (cfg && cfg.dataPomToTier) || {};
    document.querySelectorAll("[data-pom]").forEach((el) => {
      const name = el.getAttribute("data-pom") || "";
      el.setAttribute("data-pom-tier", inferPomTier(name, map));
    });
  }

  function refreshPomOutlineTiers() {
    applyPomTierCssVariables(resolvedPomOutlineConfig);
    applyPomTierAttributes(resolvedPomOutlineConfig);
    schedulePomPanelListRefresh();
  }

  applyPomTierCssVariables(resolvedPomOutlineConfig);
  applyPomTierAttributes(resolvedPomOutlineConfig);

  fetch("/shared/pom-outline-config.json", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => {
      if (j && typeof j === "object") {
        resolvedPomOutlineConfig = mergePomOutlineConfig(DEFAULT_POM_OUTLINE_CONFIG, j);
        refreshPomOutlineTiers();
      }
    })
    .catch(() => {});

  function pomVisualEnabledFromStorage() {
    try {
      return localStorage.getItem(POM_VISUAL_KEY) === "1";
    } catch {
      return false;
    }
  }

  function setPomVisualStorage(on) {
    try {
      if (on) localStorage.setItem(POM_VISUAL_KEY, "1");
      else localStorage.removeItem(POM_VISUAL_KEY);
    } catch {
      /* ignore */
    }
  }

  const POM_PANEL_KEY = "pw-pom-panel-open";
  function readPanelOpen() {
    try {
      return localStorage.getItem(POM_PANEL_KEY) === "1";
    } catch {
      return false;
    }
  }
  function writePanelOpen(open) {
    try {
      if (open) localStorage.setItem(POM_PANEL_KEY, "1");
      else localStorage.removeItem(POM_PANEL_KEY);
    } catch {
      /* ignore */
    }
  }

  /**
   * @param {Element} el
   * @param {{ ignoreZeroBoundingBox?: boolean }} [opts]
   *   Shell hosts like `#toast-root` are real `data-pom` regions but often have
   *   zero layout size until a toast is shown; they should still appear in the
   *   inspector's "Components (shell)" list (outlines toggle does not affect DOM).
   */
  function isPomRegionVisible(el, opts) {
    if (!el || !el.isConnected) return false;
    if (el.closest("[hidden]")) return false;
    if (typeof el.checkVisibility === "function") {
      try {
        if (!el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return false;
      } catch {
        /* fall through */
      }
    }
    const st = getComputedStyle(el);
    if (st.display === "none" || st.visibility === "hidden" || st.opacity === "0") return false;
    if (!opts || !opts.ignoreZeroBoundingBox) {
      const r = el.getBoundingClientRect();
      if (r.width < 1 && r.height < 1) return false;
    }
    return true;
  }

  const COMPOSITION_ROW_META = {
    "components/widgets/searchBox": { display: "searchBox", tag: "WIDGET", variant: "widget" },
    "components/widgets/table": { display: "table", tag: "WIDGET", variant: "widget" },
    "components/widgets/quantityStepper": { display: "quantityStepper", tag: "WIDGET", variant: "widget" },
    "components/widgets/featuredOffers": { display: "featuredOffers", tag: "WIDGET", variant: "widget" },
    "components/widgets/productCard": { display: "productCard", tag: "WIDGET", variant: "widget" },
    "components/widgets/modal": { display: "modal", tag: "WIDGET", variant: "widget" },
  };
  function metaForCompositionField(field) {
    return COMPOSITION_ROW_META[field] || { display: field, tag: "WIDGET", variant: "widget" };
  }

  /** Whether a `data-pom` marker is visible on screen (modal open, toast showing, etc.). */
  function isPomMarkerVisible(pomField) {
    const field = (pomField || "").trim();
    if (!field) return false;
    if (field === "components/shell/toast") {
      const root = document.getElementById("toast-root");
      if (!root) return false;
      const toasts = root.querySelectorAll(".toast");
      for (const t of toasts) {
        if (isPomRegionVisible(t)) return true;
      }
      return false;
    }
    const nodes = document.querySelectorAll(`[data-pom="${field}"]`);
    if (!nodes.length) return false;
    for (const el of nodes) {
      const tier = el.getAttribute("data-pom-tier");
      if (isPomRegionVisible(el, { ignoreZeroBoundingBox: tier === "componentOuter" })) return true;
    }
    return false;
  }

  function parseCompositionAttr(el) {
    return (el.getAttribute("data-pom-composition") || "")
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  /** All shell `componentOuter` markers on this route (listed even when hidden). */
  function collectShellComponentNames() {
    const outer = new Set();
    document.querySelectorAll('[data-pom-tier="componentOuter"]').forEach((el) => {
      const name = (el.getAttribute("data-pom") || "").trim();
      if (name.startsWith("components/shell/")) outer.add(name);
    });
    return Array.from(outer).sort((a, b) => a.localeCompare(b));
  }

  function fillShellComponentList(ul, names) {
    ul.textContent = "";
    if (!names.length) {
      const li = document.createElement("li");
      li.className = "pw-pom-visual-names__empty";
      li.textContent = "(none on page)";
      ul.appendChild(li);
      return;
    }
    names.forEach((n) => {
      const li = document.createElement("li");
      li.className = "pw-pom-visual-shell-row";
      const nameEl = document.createElement("span");
      nameEl.className = "pw-pom-visual-shell-row__name";
      nameEl.textContent = n;
      const stateEl = document.createElement("span");
      stateEl.className = "pw-pom-visual-tree__state";
      stateEl.textContent = isPomMarkerVisible(n) ? "visible" : "hidden";
      li.appendChild(nameEl);
      li.appendChild(stateEl);
      ul.appendChild(li);
    });
  }

  function renderPageSectionList(pageUl) {
    pageUl.textContent = "";
    const blocks = [];
    document.querySelectorAll('[data-pom-tier="page"]').forEach((el) => {
      if (!isPomRegionVisible(el)) return;
      const name = (el.getAttribute("data-pom") || "").trim();
      if (!name) return;
      blocks.push({ name, fields: parseCompositionAttr(el) });
    });
    blocks.sort((a, b) => a.name.localeCompare(b.name));
    if (!blocks.length) {
      const li = document.createElement("li");
      li.className = "pw-pom-visual-names__empty";
      li.textContent = "(none visible)";
      pageUl.appendChild(li);
      return;
    }
    blocks.forEach(({ name, fields }) => {
      const li = document.createElement("li");
      li.className = "pw-pom-visual-page-block";
      const nameEl = document.createElement("div");
      nameEl.className = "pw-pom-visual-page-block__name";
      nameEl.textContent = name;
      li.appendChild(nameEl);
      if (fields.length) {
        const tree = document.createElement("div");
        tree.className = "pw-pom-visual-tree";
        fields.forEach((f) => {
          const meta = metaForCompositionField(f);
          const row = document.createElement("div");
          row.className = "pw-pom-visual-tree__row";
          const pipe = document.createElement("span");
          pipe.className = "pw-pom-visual-tree__pipe";
          pipe.textContent = "│";
          const body = document.createElement("span");
          body.className = "pw-pom-visual-tree__body";
          body.textContent = meta.display;
          const stateEl = document.createElement("span");
          stateEl.className = "pw-pom-visual-tree__state";
          stateEl.textContent = isPomMarkerVisible(f) ? "visible" : "hidden";
          const tagEl = document.createElement("span");
          tagEl.className = "pw-pom-visual-tree__tag";
          tagEl.textContent = meta.tag;
          row.appendChild(pipe);
          row.appendChild(body);
          row.appendChild(stateEl);
          row.appendChild(tagEl);
          tree.appendChild(row);
        });
        li.appendChild(tree);
      }
      pageUl.appendChild(li);
    });
  }

  function renderPomPanelLists() {
    const pageUl = document.getElementById("pw-pom-visual-list-page");
    const outerUl = document.getElementById("pw-pom-visual-list-outer");
    if (!pageUl || !outerUl) return;
    fillShellComponentList(outerUl, collectShellComponentNames());
    renderPageSectionList(pageUl);
    fitPomPanelSize();
  }

  /** Size panel to content so toggling outlines does not leave a stray scrollbar. */
  function fitPomPanelSize() {
    const panel = document.getElementById("pw-pom-visual-panel");
    if (!panel || panel.hidden) return;
    panel.style.height = "auto";
    panel.style.maxHeight = "none";
    panel.style.overflowY = "hidden";
    const natural = panel.scrollHeight;
    const cap = Math.min(560, Math.round(window.innerHeight * 0.58));
    if (natural <= cap) {
      panel.style.maxHeight = natural + 4 + "px";
    } else {
      panel.style.maxHeight = cap + "px";
      panel.style.overflowY = "auto";
    }
  }

  function applyPanelOpenUi() {
    const panel = document.getElementById("pw-pom-visual-panel");
    const fab = document.getElementById("pw-pom-visual-widget");
    if (!panel || !fab) return;
    const open = readPanelOpen();
    panel.hidden = !open;
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    fab.setAttribute("aria-expanded", open ? "true" : "false");
    fab.classList.toggle("pw-pom-visual-widget--active", open);
    fab.title = open ? "Close POM inspector" : "Open POM inspector";
    fab.setAttribute("aria-label", open ? "Close POM inspector" : "Open POM inspector");
    if (open) {
      renderPomPanelLists();
      fitPomPanelSize();
    }
  }

  let pomListRefreshTimer = null;
  function schedulePomPanelListRefresh() {
    const panel = document.getElementById("pw-pom-visual-panel");
    if (!panel || panel.hidden) return;
    clearTimeout(pomListRefreshTimer);
    pomListRefreshTimer = setTimeout(() => {
      renderPomPanelLists();
      fitPomPanelSize();
    }, 100);
  }

  function applyPomVisualFromStorage() {
    if (!document.body) return;
    const on = pomVisualEnabledFromStorage();
    document.body.classList.toggle("pom-visual", on);
    const outlinesToggle = document.getElementById("pw-pom-visual-outlines-toggle");
    if (outlinesToggle) outlinesToggle.checked = on;
    refreshPomOutlineTiers();
    fitPomPanelSize();
  }

  function mountPomVisualWidget() {
    if (document.getElementById("pw-pom-visual-root")) return;
    const root = document.createElement("div");
    root.id = "pw-pom-visual-root";
    root.className = "pw-pom-visual-root";
    const panel = document.createElement("div");
    panel.id = "pw-pom-visual-panel";
    panel.className = "pw-pom-visual-panel";
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-label", "POM inspector");
    panel.hidden = true;
    panel.setAttribute("aria-hidden", "true");

    const title = document.createElement("div");
    title.className = "pw-pom-visual-panel__title";
    title.textContent = "POM inspector";
    const header = document.createElement("div");
    header.className = "pw-pom-visual-panel__header";
    header.appendChild(title);
    const readmeLink = document.createElement("a");
    readmeLink.className = "pw-pom-visual-panel__readme-link";
    readmeLink.href = "/readme/";
    readmeLink.textContent = "README";
    readmeLink.title = "Project README (not a store page)";
    header.appendChild(readmeLink);
    panel.appendChild(header);

    const toggleRow = document.createElement("label");
    toggleRow.className = "pw-pom-visual-toggle-row";
    const outlinesToggle = document.createElement("input");
    outlinesToggle.type = "checkbox";
    outlinesToggle.id = "pw-pom-visual-outlines-toggle";
    outlinesToggle.checked = pomVisualEnabledFromStorage();
    outlinesToggle.addEventListener("change", () => {
      setPomVisualStorage(outlinesToggle.checked);
      applyPomVisualFromStorage();
    });
    const toggleLabel = document.createElement("span");
    toggleLabel.textContent = "POM outlines";
    toggleRow.appendChild(outlinesToggle);
    toggleRow.appendChild(toggleLabel);
    panel.appendChild(toggleRow);

    function addSection(classMod, heading, listId) {
      const wrap = document.createElement("div");
      wrap.className = "pw-pom-visual-section pw-pom-visual-section--" + classMod;
      const lab = document.createElement("div");
      lab.className = "pw-pom-visual-section__label";
      lab.textContent = heading;
      const ul = document.createElement("ul");
      ul.id = listId;
      ul.className = "pw-pom-visual-names";
      wrap.appendChild(lab);
      wrap.appendChild(ul);
      panel.appendChild(wrap);
    }
    addSection("outer", "Shell (components)", "pw-pom-visual-list-outer");
    addSection("page", "Page", "pw-pom-visual-list-page");

    const fab = document.createElement("button");
    fab.type = "button";
    fab.id = "pw-pom-visual-widget";
    fab.className = "pw-pom-visual-widget";
    fab.setAttribute("aria-haspopup", "true");
    fab.setAttribute("aria-controls", "pw-pom-visual-panel");
    fab.setAttribute("aria-expanded", "false");
    fab.setAttribute("aria-label", "Open POM inspector");
    fab.title = "Open POM inspector";
    fab.innerHTML =
      '<svg class="pw-pom-visual-widget__icon" width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="none">' +
      '<rect x="2.5" y="2.5" width="19" height="19" rx="3" stroke="currentColor" stroke-width="1.5" opacity="0.35"/>' +
      '<rect x="7" y="7" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="2"/>' +
      "</svg>";
    fab.addEventListener("click", (e) => {
      e.stopPropagation();
      writePanelOpen(!readPanelOpen());
      applyPanelOpenUi();
    });

    root.appendChild(panel);
    root.appendChild(fab);
    document.body.appendChild(root);
    applyPanelOpenUi();

    try {
      const mo = new MutationObserver(() => schedulePomPanelListRefresh());
      mo.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["hidden", "class", "style", "data-pom", "data-pom-tier", "data-pom-composition"],
      });
    } catch {
      /* ignore */
    }
    window.addEventListener("resize", () => {
      schedulePomPanelListRefresh();
      fitPomPanelSize();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && readPanelOpen()) {
        writePanelOpen(false);
        applyPanelOpenUi();
      }
    });
  }

  mountPomVisualWidget();
  applyPomVisualFromStorage();
  window.addEventListener("pageshow", () => {
    applyPomVisualFromStorage();
    applyPanelOpenUi();
    renderCartBadge();
    syncProductPricing();
  });

  syncProductPricing();
})();
