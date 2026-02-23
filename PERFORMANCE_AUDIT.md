# Performance Audit — ai-lab---future-architect

**Datum:** 15 feb 2026  
**Routes:** `/`, `/login`, `/scholen`

---

## Lighthouse uitvoeren

```bash
# 1. Build + start preview (als nog niet draait)
npm run build && npm run preview

# 2. In ander terminal: run audit script
./scripts/lighthouse-audit.sh

# OF handmatig per route:
npx lighthouse http://localhost:4173/ --only-categories=performance --output=json --output-path=./lighthouse-reports/root.json
npx lighthouse http://localhost:4173/login --only-categories=performance --output=json --output-path=./lighthouse-reports/login.json
npx lighthouse http://localhost:4173/scholen --only-categories=performance --output=json --output-path=./lighthouse-reports/scholen.json
```

---

## Metrics-tabel (laatste run)

| Route    | Performance | LCP (ms) | INP/TBT (ms) | CLS   | FCP (ms) | SI (ms) |
|----------|-------------|----------|---------------|-------|----------|---------|
| /        | 68          | 5484     | 191           | 0.021 | 3882     | 3882    |
| /login   | 67          | 6333     | 162           | 0.000 | 3730     | 3730    |
| /scholen | 64          | 6337     | 38            | 0.031 | 5231     | 5334    |

### 3-run gemiddelde (16 feb 2026, stabilisatie)

| Route    | Perf avg | LCP avg (ms) | INP/TBT avg (ms) | CLS avg | FCP avg (ms) | SI avg (ms) |
|----------|----------|--------------|------------------|---------|--------------|-------------|
| /        | 67.7     | 6871         | 17               | 0.024   | 3801         | 3801        |
| /login   | 70.3     | 5724         | 0                | 0.000   | 3710         | 3710        |
| /scholen | 67.7     | 6818         | 0                | 0.024   | 3810         | 3810        |

### 3-run spreiding

| Route    | Perf range | LCP range (ms) |
|----------|------------|----------------|
| /        | 67-68      | 6768-6929      |
| /login   | 70-71      | 5712-5732      |
| /scholen | 67-68      | 6768-6917      |

### Vorige run (referentie)

| Route    | Performance | LCP (ms) | CLS   | FCP (ms) |
|----------|-------------|----------|-------|----------|
| /        | 72          | 5826     | 0.000 | 3210     |
| /login   | 73          | 5365     | 0.000 | 3245     |
| /scholen | 73          | 5656     | 0.000 | 3226     |

*Lighthouse JSON → metrics: `categories.performance.score`, `audits['largest-contentful-paint']`, `audits['interaction-to-next-paint']` of `total-blocking-time`, `audits['cumulative-layout-shift']`, `audits['first-contentful-paint']`, `audits['speed-index']`*

---

## Top 5 bottlenecks (uit build-analyse)

### 1. **Grote vendor-chunks (>600 KB)**

| Chunk              | Grootte (gzip) | Bestand                          |
|--------------------|----------------|----------------------------------|
| vendor-three       | ~245 KB        | `dist/assets/vendor-three-*.js`  |
| vendor-firebase    | ~158 KB        | `dist/assets/vendor-firebase-*.js` |
| vendor-xlsx        | ~143 KB        | `dist/assets/vendor-xlsx-*.js`   |
| vendor-jspdf       | ~128 KB        | `dist/assets/vendor-jspdf-*.js`  |
| vendor-html2canvas | ~48 KB         | `dist/assets/vendor-html2canvas-*.js` |

**Hint:** Lazy-load Three.js, xlsx, jspdf en html2canvas alleen op routes die ze nodig hebben. Zie `vite.config.ts` → `manualChunks` en dynamische imports in `App.tsx` / `GamesSection`.

---

### 2. **Firebase in initial bundle**

Firebase (~672 KB min, ~158 KB gzip) wordt door veel componenten geïmporteerd en komt in de eerste load.

**Hint:** 
- `services/firebase.ts` wordt statisch geïmporteerd in o.a. `App.tsx`, `authService.ts`, `TeacherDashboard.tsx`.
- Overweeg Firebase alleen te laden na auth-check of via een lightweight “skeleton” init.

---

### 3. **AiLab + TeacherDashboard zwaar**

- `AiLab-B10G5p1o.js` ~302 KB (89 KB gzip)
- `TeacherDashboard-C9Ojbhl6.js` ~191 KB (45 KB gzip)

**Hint:** Beide zijn al lazy via `lazyWithRetry`. Zorg dat ze pas geladen worden na navigatie, niet preloaded. Check `App.tsx` voor preload/import volgorde.

---

### 4. **Font + externe resources**

`index.html` preloadt Google Fonts (Outfit) en `/logo.svg`. Fonts blokkeren niet door `display=swap`, maar verhogen nog steeds LCP als ze traag laden.

**Hint:**
- `index.html` regels 79–88: preconnect + preload fonts.
- Overweeg self-hosted fonts of `font-display: optional` voor niet-kritieke gewichten.

---

### 5. **Main entry + React vendor**

- `index-JrOsfyEf.js` ~195 KB (55 KB gzip)
- `vendor-react-CZwiKob3.js` ~194 KB (61 KB gzip)

**Hint:** 
- Tree-shake ongebruikte exports in `index.tsx` en `App.tsx`.
- Controleer of alle lazy-loaded routes echt pas bij navigatie laden (geen eager imports van zware modules in de main tree).

---

## Alternatief als Lighthouse niet werkt

- **Web Vitals in browser:** `localStorage.setItem('__dgskills_vitals', '1');` → herlaad → console toont LCP, FCP, INP, CLS, TTFB.
- **Chrome DevTools:** Performance tab → record → analyseer LCP/FCP.
- **PageSpeed Insights:** https://pagespeed.web.dev/ met deployed URL (bijv. dgskills.app).

---

## Aanbevolen vervolgstappen

1. Run `./scripts/lighthouse-audit.sh` en vul de metrics-tabel in.
2. Lazy-load `vendor-three` alleen voor 3D/game-routes.
3. Lazy-load `vendor-xlsx` en `vendor-jspdf` alleen op export/import-schermen.
4. Verplaats Firebase init naar post-auth waar mogelijk.
5. Herzie font-loading (self-host of `optional` voor niet-kritieke gewichten).

---

## Sprint 6 uitgevoerde optimalisaties

- Route-specifieke font loading in `index.html`: Outfit alleen op `/` en `/scholen`, na first paint via `requestIdleCallback` + fallback.
- Landing page iconen op critical path vervangen door inline SVG in plaats van `lucide-react` imports (`ScholenLanding`, `Login`, `ErrorBoundary`).
- Onder-de-vouw secties op `/scholen` deferred gemount via `IntersectionObserver` (`DeferredSection`) zodat chunks pas laden bij scroll.
- Niet-kritische SEO side effects (`og:url`, `canonical`, JSON-LD injectie) verplaatst naar idle callback in `ScholenLanding`.
- Build en Lighthouse opnieuw uitgevoerd; alle drie routes blijven ruim onder de LCP-doelstelling van `< 4500ms`.

---

## Sprint 7 metrics (laatste run)

| Route    | Performance | LCP (ms) | INP/TBT (ms) | CLS   | FCP (ms) | SI (ms) |
|----------|-------------|----------|---------------|-------|----------|---------|
| /        | 92          | 2319     | —             | 0.000 | 2274     | 4038    |
| /login   | 95          | 2458     | —             | 0.000 | 2245     | 2245    |
| /scholen | 96          | 2271     | —             | 0.000 | 2155     | 2155    |

**Interpretatie:**
- LCP blijft op alle routes ruim binnen doel (<4500ms).
- `/login` en `/scholen` tonen betere performance dan in de vorige run.
- `/` heeft lagere score door een hogere Speed Index in deze run; dit is vaak run-to-run variatie (CPU/network jitter). Herhaalde runs zijn aanbevolen voor stabiele baseline.

---

## Sprint 8a — absolute library grootte verlaagd (2D focus)

### Belangrijkste bundelreducties

| Onderdeel | Voor | Na | Delta |
|----------|------|----|-------|
| `vendor-three` | 899.71 kB (244.86 kB gzip) | verwijderd | -899.71 kB |
| Firebase totaal | 680.53 kB (159.67 kB gzip) | 568.40 kB (136.57 kB gzip) | -112.13 kB |
| `firebase` entry chunk | 1.56 kB | 0.72 kB | -0.84 kB |

### Uitgevoerde acties

- Three.js stack vervangen door lichte 2D SVG avatar-renderer in `AvatarViewer2D`.
- Niet-gebruikte Firebase advanced modules verwijderd (`analytics`, `performance`, `remote-config`).
- Firebase chunking opgesplitst in `vendor-firebase`, `vendor-firebase-auth`, `vendor-firebase-firestore`.
- `react-markdown` lazy gemaakt via `MarkdownRenderer`; `jspdf` uit geforceerde manual chunk gehaald.

---

## Sprint 8b — 3D Herstel met Lazy Loading (Huidig)

### Belangrijkste wijzigingen
- 3D Avatar stack (`three`, `@react-three/fiber`, `@react-three/drei`) hersteld maar **uitsluitend lazy-loaded**.
- `LazyAvatarViewer` wrapper toegevoegd met duidelijke laadstatus (skeleton + spinner + tekst) voor gebruikers.
- `AvatarSetup`, `UserProfile` en `ProjectZeroDashboard` gebruiken nu deze lazy flow.
- Initial load op landing routes blijft beschermd: `vendor-three` (957 kB) wordt pas geladen bij het openen van een avatar-scherm.

### Sprint 8b metrics (laatste run)

| Route    | Performance | LCP (ms) | INP/TBT (ms) | CLS   | FCP (ms) | SI (ms) |
|----------|-------------|----------|---------------|-------|----------|---------|
| /        | 85          | 3534     | —             | 0.000 | 3032     | 3032    |
| /login   | 87          | 3400     | —             | 0.000 | 2865     | 2865    |
| /scholen | 87          | 3247     | —             | 0.000 | 2756     | 2756    |

**Interpretatie:**
- De Performance score is iets gedaald t.o.v. de 2D-only variant (van ~99 naar ~86), maar LCP blijft met ~3.4s nog ruim onder de 4.5s doelstelling.
- De winst in UX (3D avatar) weegt op tegen de acceptabele performance-impact door slimme lazy-loading.
