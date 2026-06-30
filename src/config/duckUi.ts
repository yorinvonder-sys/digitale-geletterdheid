// Acid #e1ff01 nooit als tekstkleur op lichte achtergrond — alleen als vlak met ink-content.
// Slash-opacity alleen veelvouden van 5.

export const duckUi = {
    card: 'rounded-[1.5rem] bg-white shadow-duck-soft',
    cardAlt: 'rounded-[1.5rem] bg-duck-bgLight',
    cardInk: 'rounded-[1.5rem] bg-duck-ink text-white',
    pill: 'inline-flex items-center gap-2 rounded-full border border-duck-ink px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-duck-ink',
    btnPrimary: 'inline-flex items-center justify-center gap-2 rounded-full border border-duck-ink bg-duck-acid px-6 py-2.5 text-sm font-extrabold text-duck-ink transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    btnInk: 'inline-flex items-center justify-center gap-2 rounded-full bg-duck-ink px-6 py-2.5 text-sm font-extrabold text-duck-acid transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    btnGhost: 'inline-flex items-center justify-center gap-2 rounded-full border border-duck-ink/20 bg-duck-bgLight px-6 py-2.5 text-sm font-extrabold text-duck-ink transition-all duration-300 hover:border-duck-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duck-ink focus-visible:ring-offset-2',
    input: 'rounded-xl border-2 border-duck-ink/15 bg-white px-4 py-3 text-sm font-semibold text-duck-ink outline-none focus:border-duck-ink placeholder:text-duck-ink/40',
    modalOverlay: 'fixed inset-0 bg-duck-ink/40 backdrop-blur-[2px]',
    modalPanel: 'rounded-[1.5rem] bg-white p-6 shadow-duck-soft',
    progressTrack: 'rounded-full bg-duck-ink/10',
    progressFill: 'rounded-full bg-duck-acid ring-1 ring-duck-ink/15',
} as const;

// Leesbare tekst-/icoonkleur op een dynamische rolkleur-achtergrond:
// donkere ink op lichte vlakken (zoals acid #e1ff01), wit op donkere vlakken.
// Voorkomt witte tekst op fel geel (zie comment bovenaan).
export const readableTextOn = (hex: string): string => {
    const c = hex.replace('#', '');
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 150 ? '#202023' : '#ffffff'; // acid → ink, ink → wit
};

// Zachte tint van een rolkleur voor grote highlight-vlakken (design.md: acid/20-stijl).
export const tintOf = (hex: string, alpha = 0.14): string => {
    const c = hex.replace('#', '');
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
