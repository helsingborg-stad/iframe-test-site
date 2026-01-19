const l = document.createElement("link");
l.rel = "stylesheet"; l.href = "https://iframe.municipio.tech/styles.css";
document.head.appendChild(l);

if (window.location !== window.parent.location) {
  document.querySelector("html, body").style.height = "auto";
  const sendMessageToParent = () =>
    window.parent.postMessage({ height: document.body.clientHeight }, '*');
  sendMessageToParent();
  new ResizeObserver(() => sendMessageToParent()).observe(document.body);
}
