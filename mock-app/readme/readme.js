(function loadReadme() {
  const root = document.getElementById("readme-content");
  if (!root) return;

  fetch("./README.md", { cache: "no-cache" })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then(async (md) => {
      root.setAttribute("aria-busy", "false");
      root.innerHTML = marked.parse(md, { gfm: true, breaks: false });

      root.querySelectorAll("pre > code.language-mermaid").forEach((code) => {
        const pre = document.createElement("pre");
        pre.className = "mermaid";
        pre.textContent = code.textContent;
        code.parentElement.replaceWith(pre);
      });

      const blocks = root.querySelectorAll("pre.mermaid");
      if (blocks.length && typeof mermaid !== "undefined") {
        mermaid.initialize({ startOnLoad: false, theme: "neutral", securityLevel: "strict" });
        await mermaid.run({ nodes: blocks });
      }
    })
    .catch((err) => {
      root.setAttribute("aria-busy", "false");
      root.innerHTML =
        '<p class="readme-error">Could not load README.md. Run <code>npm run build:mock</code> or start the mock app via npm (copies README into this folder).</p>';
      console.error(err);
    });
})();
