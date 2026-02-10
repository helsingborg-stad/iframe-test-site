interface Assets {
	css?: string;
}
export const registerIFrameHost = (
	{ id, assets, allowedOrigin }: { id: string; assets: Assets; allowedOrigin: string },
	window: Window,
) => {
	const { document } = window;

	document.addEventListener('DOMContentLoaded', () => {
		const iframe = document.getElementById(id) as HTMLIFrameElement | null;

		if (iframe) {
			window.addEventListener('message', (e: MessageEvent<{ height?: number }>) => {
				if (e.origin !== allowedOrigin) return;
				if (e.data?.height) iframe.style.height = `${e.data.height}px`;
				iframe.style.visibility = 'visible';
			});
			iframe.onload = () => {
				iframe.contentWindow?.postMessage(assets, allowedOrigin);
			};
		}
	});
};

export const registerIFrameClient = (allowedParent: string, window: Window) => {
	const { document } = window;

	window.addEventListener('message', async (e: MessageEvent<Assets>) => {
		if (allowedParent !== e.origin) return;
		if (e.data) {
			const { css = '' } = e.data;

			const style = document.createElement('style');
			style.textContent = css;
			document.head.appendChild(style);

			const sendMessageToParent = () =>
				window.parent.postMessage({ height: document.body.clientHeight }, allowedParent);

			requestAnimationFrame(() => {
				sendMessageToParent();
				new ResizeObserver(() => sendMessageToParent()).observe(document.body);
			});
		}
	});
	if (window.location === window.parent.location) {
		return;
	}
	const elem = document?.querySelector('html, body') as HTMLElement;

	if (elem) {
		elem.style.height = 'auto';
	}
	document?.querySelectorAll<HTMLAnchorElement>('a.btn').forEach((x) => {
		x.tabIndex = 0;
		x.role = "button";
	})

};
