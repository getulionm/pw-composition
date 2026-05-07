/**
 * Control-center mock shell: Tools menu chevrons, user dropdown, nav drawer < >.
 * Expects ids: tools-btn, tools-panel, user-menu-btn, user-dropdown, collapse-menu-btn, side-nav, app-layout
 */
(function initMockShell() {
  const toolsBtn = document.getElementById("tools-btn");
  const toolsPanel = document.getElementById("tools-panel");
  const toolsChev = document.querySelector("#tools-btn .tools-chev");

  function setToolsChev(open) {
    if (toolsChev) toolsChev.textContent = open ? "▴" : "▾";
  }

  if (toolsBtn && toolsPanel) {
    setToolsChev(!toolsPanel.hidden);
    toolsBtn.addEventListener("click", () => {
      toolsPanel.hidden = !toolsPanel.hidden;
      const isOpen = !toolsPanel.hidden;
      toolsBtn.setAttribute("aria-expanded", String(isOpen));
      setToolsChev(isOpen);
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

  function applyWorkspaceToolsNav() {
    const ws = document.body.getAttribute("data-workspace") || "ADMIN";
    document.querySelectorAll("a[data-nav='create-tool']").forEach((a) => {
      const row = a.closest(".tools-nav-row--create");
      const lock = row && row.querySelector(".create-tool-lock-icon");
      if (ws === "USER") {
        a.setAttribute("aria-disabled", "true");
        a.classList.add("nav-link-locked");
        if (lock) {
          lock.hidden = false;
          lock.removeAttribute("aria-hidden");
        }
      } else {
        a.removeAttribute("aria-disabled");
        a.classList.remove("nav-link-locked");
        if (lock) {
          lock.hidden = true;
          lock.setAttribute("aria-hidden", "true");
        }
      }
    });
  }

  function syncWelcomeWorkspace() {
    const el = document.getElementById("welcome-workspace");
    if (!el) return;
    const ws = document.body.getAttribute("data-workspace") || "ADMIN";
    el.textContent = ws;
  }

  function syncUserMenuButtonLabel() {
    const btn = document.getElementById("user-menu-btn");
    if (!btn) return;
    const ws = document.body.getAttribute("data-workspace") || "ADMIN";
    btn.textContent = ws === "USER" ? "User menu" : "Admin menu";
  }

  const WORKSPACE_KEY = "pw-mock-workspace";

  function readStoredWorkspace() {
    try {
      const v = localStorage.getItem(WORKSPACE_KEY);
      return v === "ADMIN" || v === "USER" ? v : null;
    } catch {
      return null;
    }
  }

  function writeStoredWorkspace(value) {
    try {
      localStorage.setItem(WORKSPACE_KEY, value);
    } catch {
      /* ignore */
    }
  }

  const workspaceSelect = document.getElementById("workspace-select");
  if (workspaceSelect) {
    const stored = readStoredWorkspace();
    if (stored) {
      workspaceSelect.value = stored;
    }
    const sync = () => {
      const v = workspaceSelect.value;
      document.body.setAttribute("data-workspace", v);
      writeStoredWorkspace(v);
      syncWelcomeWorkspace();
      syncUserMenuButtonLabel();
      applyWorkspaceToolsNav();
    };
    sync();
    workspaceSelect.addEventListener("change", sync);
  } else {
    document.body.setAttribute("data-workspace", "ADMIN");
    applyWorkspaceToolsNav();
    syncWelcomeWorkspace();
    syncUserMenuButtonLabel();
  }

  /** POM outline toggle: floating widget + localStorage `pw-pom-visual` === "1" */
  const POM_VISUAL_KEY = "pw-pom-visual";

  /** URL feature flag: `?pom=1` (or `pomOutlines=1` / `pomVisual=1`) turns outlines on; `?pom=0` turns them off. */
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

  /** Default matches `pom-outline-config.json`; fetch overrides. */
  const DEFAULT_POM_OUTLINE_CONFIG = {
    tierColors: {
      page: { outline: "#6d28d9", labelBackground: "#4c1d95", labelText: "#f5f3ff" },
      componentOuter: { outline: "#1d4ed8", labelBackground: "#1e3a8a", labelText: "#eff6ff" },
      componentInner: { outline: "#047857", labelBackground: "#064e3b", labelText: "#ecfdf5" }
    },
    dataPomToTier: {
      "components/shell/masthead": "componentOuter",
      "components/shell/navigationDrawer": "componentOuter",
      "components/widgets/table": "componentInner",
      "components/widgets/searchBox": "componentInner",
      "components/widgets/modal": "componentInner",
      "pages/controlCenter.home": "page",
      "pages/controlCenter.records": "page",
      "pages/controlCenter.recordDetails": "page",
      "pages/controlCenter.createTool": "page",
      "pages/controlCenter.viewTools": "page"
    }
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
      /* private mode / denied */
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

  function isPomRegionVisible(el) {
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
    const r = el.getBoundingClientRect();
    if (r.width < 1 && r.height < 1) return false;
    return true;
  }

  /**
   * `data-pom-composition` on route `<main>` drives the PAGE section in the POM inspector (green dashed outlines unchanged).
   * Inner `data-pom` markers listed there are omitted from "Widgets (green)" so overlays/non-composed widgets still stand out.
   */
  var COMPOSITION_ROW_META = {
    "components/widgets/searchBox": { display: "searchBox", tag: "WIDGET", variant: "widget" },
    "components/widgets/table": { display: "table", tag: "WIDGET", variant: "widget" },
  };

  function metaForCompositionField(field) {
    var known = COMPOSITION_ROW_META[field];
    if (known) return known;
    return { display: field, tag: "WIDGET", variant: "widget" };
  }

  function parseCompositionAttr(el) {
    const raw = el.getAttribute("data-pom-composition") || "";
    return raw
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  /** Visible `data-pom` regions with tier componentOuter (masthead, drawer, …). */
  function collectVisibleShellComponentNames() {
    const outer = new Set();
    document.querySelectorAll("[data-pom]").forEach((el) => {
      if (!isPomRegionVisible(el)) return;
      const name = (el.getAttribute("data-pom") || "").trim();
      if (!name) return;
      if (el.getAttribute("data-pom-tier") === "componentOuter") outer.add(name);
    });
    return Array.from(outer).sort((a, b) => a.localeCompare(b));
  }

  /**
   * `data-pom` class names already listed under PAGE via `data-pom-composition` on a visible route `<main>`.
   * Those stay out of "Widgets (green)" — e.g. modal is not in composition, so it only appears there.
   */
  function collectInnerPomNamesFromVisiblePageComposition() {
    const names = new Set();
    document.querySelectorAll('[data-pom-tier="page"]').forEach((el) => {
      if (!isPomRegionVisible(el)) return;
      parseCompositionAttr(el).forEach((field) => {
        names.add(metaForCompositionField(field).display);
      });
    });
    return names;
  }

  /** Visible `data-pom` regions with tier componentInner, excluding names already under PAGE composition. */
  function collectVisibleInnerWidgetNames() {
    const inner = new Set();
    const composed = collectInnerPomNamesFromVisiblePageComposition();
    document.querySelectorAll("[data-pom]").forEach((el) => {
      if (!isPomRegionVisible(el)) return;
      const name = (el.getAttribute("data-pom") || "").trim();
      if (!name) return;
      if (el.getAttribute("data-pom-tier") !== "componentInner") return;
      if (composed.has(name)) return;
      inner.add(name);
    });
    return Array.from(inner).sort((a, b) => a.localeCompare(b));
  }

  function fillNameList(ul, names) {
    ul.textContent = "";
    if (!names.length) {
      const li = document.createElement("li");
      li.className = "pw-pom-visual-names__empty";
      li.textContent = "(none visible)";
      ul.appendChild(li);
      return;
    }
    names.forEach((n) => {
      const li = document.createElement("li");
      li.textContent = n;
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
        const sub = document.createElement("ul");
        sub.className = "pw-pom-visual-composition";
        fields.forEach((f) => {
          const meta = metaForCompositionField(f);
          const cli = document.createElement("li");
          cli.className =
            "pw-pom-visual-composition-row pw-pom-visual-composition-row--" + meta.variant;
          const lab = document.createElement("span");
          lab.className = "pw-pom-visual-composition-row__label";
          lab.textContent = meta.display;
          const tagEl = document.createElement("span");
          tagEl.className = "pw-pom-visual-composition-row__tag";
          tagEl.textContent = "(" + meta.tag + ")";
          cli.appendChild(lab);
          cli.appendChild(tagEl);
          sub.appendChild(cli);
        });
        li.appendChild(sub);
      }
      pageUl.appendChild(li);
    });
  }

  function renderPomPanelLists() {
    const pageUl = document.getElementById("pw-pom-visual-list-page");
    const outerUl = document.getElementById("pw-pom-visual-list-outer");
    const innerUl = document.getElementById("pw-pom-visual-list-inner");
    if (!pageUl || !outerUl || !innerUl) return;
    renderPageSectionList(pageUl);
    fillNameList(outerUl, collectVisibleShellComponentNames());
    fillNameList(innerUl, collectVisibleInnerWidgetNames());
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
    if (open) renderPomPanelLists();
  }

  let pomListRefreshTimer = null;
  function schedulePomPanelListRefresh() {
    const panel = document.getElementById("pw-pom-visual-panel");
    if (!panel || panel.hidden) return;
    clearTimeout(pomListRefreshTimer);
    pomListRefreshTimer = setTimeout(() => renderPomPanelLists(), 100);
  }

  function applyPomVisualFromStorage() {
    if (!document.body) return;
    const on = pomVisualEnabledFromStorage();
    document.body.classList.toggle("pom-visual", on);
    const outlinesToggle = document.getElementById("pw-pom-visual-outlines-toggle");
    if (outlinesToggle) outlinesToggle.checked = on;
    refreshPomOutlineTiers();
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
    panel.appendChild(title);

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

    addSection("page", "Page", "pw-pom-visual-list-page");
    addSection("outer", "Components (shell)", "pw-pom-visual-list-outer");
    addSection("inner", "Widgets (green)", "pw-pom-visual-list-inner");

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
    window.addEventListener("resize", schedulePomPanelListRefresh);

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
  });
})();
