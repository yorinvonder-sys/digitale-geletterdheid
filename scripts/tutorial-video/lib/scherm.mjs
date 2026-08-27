/**
 * Alles wat op de pagina zichtbaar moet zijn tijdens een opname.
 *
 * Playwright neemt de muisaanwijzer NIET op. Zonder deze nagemaakte cursor zie je
 * in de video dingen gebeuren zonder te zien waar geklikt wordt — dat maakt een
 * instructievideo waardeloos. Daarom tekenen we zelf een cursor, een aandachtsring
 * en een klik-rimpel in de pagina.
 */

const CURSOR_PIJL = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 2.5L19 12.2L12.4 13.2L9.2 19.6L5 2.5Z" fill="#202023" stroke="#ffffff" stroke-width="1.6" stroke-linejoin="round"/>
</svg>`;

/** Duur van de cursorbeweging; ook gebruikt om op de animatie te wachten. */
export const BEWEEG_MS = 480;
const RING_MS = 320;

const STIJL = `
#dgs-cursor {
    position: fixed; z-index: 2147483647; width: 24px; height: 24px;
    pointer-events: none; left: 50%; top: 60%;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,.35));
    transition: left ${BEWEEG_MS}ms cubic-bezier(.4,0,.2,1), top ${BEWEEG_MS}ms cubic-bezier(.4,0,.2,1);
}
#dgs-ring {
    position: fixed; z-index: 2147483645; pointer-events: none;
    border: 3px solid #e1ff01; border-radius: 14px;
    box-shadow: 0 0 0 3px rgba(32,32,35,.30), 0 8px 28px rgba(32,32,35,.18);
    opacity: 0; left: 0; top: 0; width: 0; height: 0;
    transition: all ${RING_MS}ms cubic-bezier(.4,0,.2,1);
}
#dgs-klik {
    position: fixed; z-index: 2147483646; pointer-events: none;
    width: 12px; height: 12px; border-radius: 999px; background: rgba(225,255,1,.85);
    transform: translate(-50%,-50%) scale(1); opacity: 0;
}
#dgs-klik.aan { animation: dgs-rimpel 520ms ease-out forwards; }
@keyframes dgs-rimpel {
    0%   { opacity: .9; transform: translate(-50%,-50%) scale(1); }
    100% { opacity: 0;  transform: translate(-50%,-50%) scale(6); }
}
`;

/** Zet cursor, ring en rimpel in de pagina. Idempotent. */
export const installeerOverlay = async (page) => {
    await page.addStyleTag({ content: STIJL });
    await page.evaluate((pijl) => {
        for (const id of ['dgs-cursor', 'dgs-ring', 'dgs-klik']) {
            document.getElementById(id)?.remove();
            const el = document.createElement('div');
            el.id = id;
            if (id === 'dgs-cursor') el.innerHTML = pijl;
            document.body.appendChild(el);
        }
    }, CURSOR_PIJL);
};

const slaap = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Bouwt het "regieapparaat" dat een draaiboek-beat krijgt aangereikt.
 * Zie ../beats/README.md voor de beschikbare aanroepen.
 */
export const maakRegie = (page) => {
    /** Zoekt het ZICHTBARE exemplaar; dezelfde regel als de klikrondleiding hanteert. */
    const meet = async (selector) => page.evaluate((sel) => {
        const kandidaten = Array.from(document.querySelectorAll(sel));
        const zichtbaar = kandidaten.find((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
        });
        if (!zichtbaar) return null;
        const r = zichtbaar.getBoundingClientRect();
        return { x: r.left, y: r.top, w: r.width, h: r.height };
    }, selector);

    const scrollNaar = async (selector) => {
        await page.evaluate((sel) => {
            const el = Array.from(document.querySelectorAll(sel))
                .find((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, selector);
        await slaap(650);
    };

    const ringOm = async (vak) => {
        const marge = 8;
        await page.evaluate(({ x, y, w, h, m }) => {
            const ring = document.getElementById('dgs-ring');
            if (!ring) return;
            ring.style.left = `${x - m}px`;
            ring.style.top = `${y - m}px`;
            ring.style.width = `${w + m * 2}px`;
            ring.style.height = `${h + m * 2}px`;
            ring.style.opacity = '1';
        }, { ...vak, m: marge });
    };

    const cursorNaar = async (x, y) => {
        await page.evaluate(({ px, py }) => {
            const c = document.getElementById('dgs-cursor');
            if (c) { c.style.left = `${px}px`; c.style.top = `${py}px`; }
        }, { px: x, py: y });
        // De echte muis meebewegen, zodat hover-effecten kloppen met wat je ziet.
        await page.mouse.move(x, y);
        await slaap(BEWEEG_MS + 60);
    };

    const wijsAan = async (selector) => {
        await scrollNaar(selector);
        const vak = await meet(selector);
        if (!vak) throw new Error(`[opname] geen zichtbaar element voor ${selector}`);
        await ringOm(vak);
        // Iets binnen de rechteronderhoek: de pijlpunt wijst dan het vlak in.
        await cursorNaar(vak.x + Math.min(vak.w * 0.5, 90), vak.y + Math.min(vak.h * 0.5, 26));
        await slaap(RING_MS);
        return vak;
    };

    const ringWeg = async () => {
        await page.evaluate(() => {
            const ring = document.getElementById('dgs-ring');
            if (ring) ring.style.opacity = '0';
        });
        await slaap(RING_MS);
    };

    const klik = async (selector) => {
        const vak = await wijsAan(selector);
        const x = vak.x + Math.min(vak.w * 0.5, 90);
        const y = vak.y + Math.min(vak.h * 0.5, 26);
        await page.evaluate(({ px, py }) => {
            const r = document.getElementById('dgs-klik');
            if (!r) return;
            r.style.left = `${px}px`;
            r.style.top = `${py}px`;
            r.classList.remove('aan');
            void r.offsetWidth; // herstart de animatie
            r.classList.add('aan');
        }, { px: x, py: y });
        await page.mouse.click(x, y);
        await slaap(700);
    };

    return { page, wijsAan, klik, scrollNaar, ringWeg, wacht: slaap };
};
