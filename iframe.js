const ALLOWED_PARENTS = ["https://iframe.municipio.tech"];

if (window.location !== window.parent.location) {
  document.querySelector("html, body").style.height = "auto";
  const sendMessageToParent = () =>
    window.parent.postMessage({ height: document.body.clientHeight }, '*');
  sendMessageToParent();
  new ResizeObserver(() => sendMessageToParent()).observe(document.body);
}

window.addEventListener("message", async e => {
  if (!ALLOWED_PARENTS.includes(e.origin)) return;
  if (e.data?.assets) {
    const { css = [], js = [], fonts = [] } = e.data.assets;

    // Load CSS
    css.forEach(href => {
      const l = document.createElement("link");
      l.rel = "stylesheet"; l.href = href;
      document.head.appendChild(l);
    });

    // Load JS
    for (const src of js) {
      await new Promise((res, rej) => {
        const s = document.createElement("script");
        s.src = src; s.onload = res; s.onerror = rej;
        document.body.appendChild(s);
      }).catch(err => console.error("Failed to load JS:", src, err));
    }

    // Load Fonts (FontFace API)
    fonts.forEach(f => {
      const font = new FontFace(f.family, `url(${f.src})`, f.descriptors || {});
      font.load().then(loaded => {
        document.fonts.add(loaded);
        console.log(`Font loaded: ${f.family}`);
      }).catch(err => console.error("Failed to load font:", f, err));
    });
  }
});
