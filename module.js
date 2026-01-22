var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const registerIFrameHost = ({ id, assets, allowedOrigin }, window) => {
    const { document } = window;
    document.addEventListener('DOMContentLoaded', () => {
        const iframe = document.getElementById(id);
        if (iframe) {
            window.addEventListener('message', (e) => {
                var _a;
                if (e.origin !== allowedOrigin)
                    return;
                if ((_a = e.data) === null || _a === void 0 ? void 0 : _a.height)
                    iframe.style.height = `${e.data.height}px`;
                iframe.style.visibility = 'visible';
            });
            iframe.onload = () => {
                console.log("iframe:onload");
                var _a;
                (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.postMessage(assets, allowedOrigin);
            };
        }
    });
};
export const registerIFrameClient = (allowedParent, window) => {
    const { document } = window;
    window.addEventListener('message', (e) => __awaiter(void 0, void 0, void 0, function* () {
        if (allowedParent !== e.origin)
            return;
        if (e.data) {
            const { css = [], js = [], fonts = [] } = e.data;
            // Load CSS
            css.forEach((href) => new Promise((resolve, reject) => {
                const l = document.createElement('link');
                l.rel = 'stylesheet';
                l.href = href;
                l.onload = () => {
                    const sendMessageToParent = () => window.parent.postMessage({ height: document.body.clientHeight }, allowedParent);
                    requestAnimationFrame(() => {
                        sendMessageToParent();
                        new ResizeObserver(() => sendMessageToParent()).observe(document.body);
                    });
                    resolve(true);
                };
                l.onerror = () => reject();
                document.head.appendChild(l);
            }));

            // Load JS
            for (const src of js) {
                yield new Promise((res, rej) => {
                    const s = document.createElement('script');
                    s.src = src;
                    s.onload = res;
                    s.onerror = rej;
                    document.body.appendChild(s);
                }).catch((err) => console.error('Failed to load JS:', src, err));
            }
            // Load Fonts (FontFace API)
            fonts.forEach((f) => {
                const font = new FontFace(f.family, `url(${f.src})`);
                font
                    .load()
                    .then((loaded) => {
                    document.fonts.add(loaded);
                    console.log(`Font loaded: ${f.family}`);
                })
                    .catch((err) => console.error('Failed to load font:', f, err));
            });
        }
    }));
    if (window.location === window.parent.location) {
        return;
    }
    const elem = document === null || document === void 0 ? void 0 : document.querySelector('html, body');
    if (elem) {
        elem.style.height = 'auto';
    }
};
