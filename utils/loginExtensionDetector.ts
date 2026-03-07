export const isDesktopChrome = (): boolean => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || '';
    const isChromium = /Chrome|CriOS/i.test(ua);
    const isEdge = /Edg\//i.test(ua);
    const isFirefox = /Firefox\//i.test(ua);
    const isSafari = /Safari\//i.test(ua) && !/Chrome|CriOS/i.test(ua);
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    return isChromium && !isEdge && !isFirefox && !isSafari && !isMobile;
};

export const detectExtensionSignals = (): string[] => {
    if (typeof document === 'undefined') return [];

    const signals: string[] = [];
    const html = document.documentElement;

    if (html.hasAttribute('data-new-gr-c-s-check-loaded') || html.hasAttribute('data-gr-ext-installed')) {
        signals.push('Grammarly');
    }

    if (
        document.querySelector('[data-lastpass-root], [data-lastpass-icon-root], iframe[name^="LPFrame"], iframe[id^="LPFrame"]')
    ) {
        signals.push('LastPass');
    }

    if (
        document.querySelector(
            '[data-claude-extension], [data-claude], [id*="claude" i], [class*="claude" i], iframe[src*="claude.ai" i]'
        )
    ) {
        signals.push('AI-assistent extensie');
    }

    const extensionResourceLoaded = Array.from(
        document.querySelectorAll('script[src],link[href],iframe[src]')
    ).some((node) => {
        let url = '';
        if (node instanceof HTMLScriptElement) {
            url = node.src;
        } else if (node instanceof HTMLLinkElement) {
            url = node.href;
        } else if (node instanceof HTMLIFrameElement) {
            url = node.src;
        }
        return url.startsWith('chrome-extension://');
    });

    if (extensionResourceLoaded) {
        signals.push('Chrome extensie-injectie');
    }

    return Array.from(new Set(signals));
};
