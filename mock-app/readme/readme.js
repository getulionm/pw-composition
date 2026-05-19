(function loadReadme() {
  const root = document.getElementById("readme-content");
  if (!root) return;

  /** Move explicit <a id> from markdown onto the following heading (GitHub-compatible deeplinks). */
  function applyHeadingIds(container) {
    container.querySelectorAll("a[id]").forEach((anchor) => {
      const heading = anchor.nextElementSibling;
      if (!heading || !/^H[1-3]$/.test(heading.tagName)) return;
      if (!heading.id) heading.id = anchor.id;
      anchor.remove();
    });
  }

  fetch("./README.md", { cache: "no-cache" })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then(async (md) => {
      root.setAttribute("aria-busy", "false");
      root.innerHTML = marked.parse(md, { gfm: true, breaks: false });

      applyHeadingIds(root);

      root.querySelectorAll("pre > code.language-mermaid").forEach((code) => {
        const pre = document.createElement("pre");
        pre.className = "mermaid";
        pre.textContent = code.textContent;
        code.parentElement.replaceWith(pre);
      });

      const blocks = root.querySelectorAll("pre.mermaid");
      if (blocks.length && typeof mermaid !== "undefined") {
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "strict",
          themeVariables: {
            fontSize: "16px",
            fontFamily: "system-ui, sans-serif",
          },
          flowchart: { nodeSpacing: 30, rankSpacing: 40 },
        });
        await mermaid.run({ nodes: blocks });
      }

      if (location.hash) {
        const target = root.querySelector(location.hash);
        if (target) target.scrollIntoView();
      }
    })
    .catch((err) => {
      root.setAttribute("aria-busy", "false");
      root.innerHTML =
        '<p class="readme-error">Could not load README.md. Run <code>npm run build:mock</code> or start the mock app via npm (copies README into this folder).</p>';
      console.error(err);
    });
})();
