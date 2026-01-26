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
                var variables = getComputedStyle(document.documentElement);
                var r = Array.from(getComputedStyle(document.documentElement)).filter(x => x.startsWith('--')).map(x =>
                    `${x}; ${variables}.getPropertyValue(x);
                );
                assets += `:root {\n${r.join(';\n')}}`;
                console.log(assets);
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
            const { css = '' } = e.data;
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
            const sendMessageToParent = () => window.parent.postMessage({ height: document.body.clientHeight }, allowedParent);
            requestAnimationFrame(() => {
                sendMessageToParent();
                new ResizeObserver(() => sendMessageToParent()).observe(document.body);
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
