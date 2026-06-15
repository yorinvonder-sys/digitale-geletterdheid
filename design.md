# DGSkills Design System — DUCK English Style

De visuele taal van DGSkills is gebaseerd op de DUCK English-richting: een strak, modern schooldesign met een karakter. Krachtige contrasten (donker ink op zacht grijs of bijtend zuur-geel), Fraunces serif voor koppen, Outfit voor interface-tekst en afgeronde vormen met een eigenzinnig schaduwpatroon.

---

## Kleurpalet

| Token (Tailwind) | Hex | Gebruik |
|---|---|---|
| `duck-bg` | `#f2f1ec` | Pagina-achtergrond, inputvelden |
| `duck-bgLight` | `#f8f8f5` | Lichte kaartachtergrond, succes-states |
| `duck-ink` | `#202023` | Koppen, primaire tekst, knopvulling |
| `duck-acid` | `#e1ff01` | Primaire CTA-kleur, accenten, selectie |
| `duck-gray` | `#c2c1bd` | Borders, scheidingslijnen, subtiele details |
| `duck-error` | `#ff3c21` | Foutmeldingen, validatiefouten |

### Gebruik van opacity op ink
Gebruik `duck-ink` met opacity-modifiers voor hiërarchie in tekst en borders:

| Klasse | Gebruik |
|---|---|
| `text-duck-ink` | Primaire tekst, koppen |
| `text-duck-ink/60` | Secundaire tekst, subtitels |
| `text-duck-ink/50` | Placeholder, labels |
| `text-duck-ink/40` | Iconen in inputvelden |
| `text-duck-ink/10` | Decoratieve watermerken (bijv. lettermarkeringen) |
| `border-duck-ink/15` | Standaard kaartranden |
| `border-duck-ink/10` | Lichte dividers, tab-achtergronden |

### Selectie
```css
selection:bg-duck-acid selection:text-duck-ink
```

---

## Typografie

| Rol | Klasse | Lettertype |
|---|---|---|
| Koppen (h1–h3, hero) | `font-display font-black` | Fraunces (serif) |
| Interface, body, labels | `font-sans` | Outfit (sans-serif) |
| Knoptekst | `font-black` of `font-extrabold` | Outfit |
| Kleine labels / caps | `font-black uppercase tracking-widest` | Outfit |
| Code / OTP-invoer | `font-mono tracking-widest` | Systeemfont |

- Headlines gebruiken `text-balance` en nauw regelafstand.
- Bodytekst is kort, actief en leerlinggericht.
- Gebruik nooit `font-display` voor interfacetekst — alleen voor koppen en hero-accenten.

---

## Knoppen

### Primaire CTA (acid)
```html
rounded-full bg-duck-acid px-6 py-2.5 font-extrabold text-duck-ink
transition-all hover:-translate-y-0.5 hover:bg-duck-ink hover:text-duck-acid
```

### Primaire CTA (ink — donker variant)
```html
rounded-full bg-duck-ink py-3.5 font-black text-duck-acid
shadow-[0_4px_0_rgba(0,0,0,0.25)]
transition-all hover:-translate-y-0.5 active:translate-y-0
```

### Secundaire / ghost knop
```html
rounded-full border border-duck-ink bg-transparent px-6 py-2.5 font-extrabold text-duck-ink
transition-all hover:bg-duck-ink hover:text-duck-acid
```

### Regels
- Alle knoppen: `min-h-[44px]` voor toegankelijkheid.
- Primaire knoppen zijn altijd `rounded-full`.
- Geen `rounded-xl` of `rounded-2xl` voor primaire acties — dat is de oudere `lab-*`-stijl.
- Laad-state: spinner met `border-duck-ink/25 border-t-duck-ink`.

---

## Kaarten

```html
rounded-[1.75rem] border border-duck-ink/15 bg-white shadow-duck-soft
```

Alternatieven:
- `rounded-[1.6rem]` voor kleinere kaarten (missiekaarten, skillkaarten)
- `bg-duck-acid` voor geaccentueerde kaarten
- `bg-duck-bg` voor achtergrondkaarten

Schaduw: `shadow-duck-soft` = `2px 4px 24px rgba(199,197,188,0.30)`

---

## Inputvelden

```html
rounded-xl border border-duck-ink/15 bg-duck-bg
py-3 pl-12 pr-4 text-sm font-bold text-duck-ink
outline-none placeholder:text-duck-ink/40
transition-all focus:border-duck-ink focus:ring-2 focus:ring-duck-ink/10
```

- Fout-staat border: `border-duck-acid` (geel, niet rood — voor waarschuwingen)
- Foutmeldingen: `bg-duck-error/10 border border-duck-error/25 text-duck-ink`
- Succes/bevestiging: `bg-duck-bgLight border border-duck-ink/15 text-duck-ink`

---

## Header (navigatie)

- Vast bovenaan: `fixed inset-x-0 top-0 z-50`
- Transparant bij bovenkant pagina
- Na scrollen: `bg-duck-bg/95 backdrop-blur-md shadow-[0_1px_0_rgba(32,32,35,0.10)]`
- Mobiel menu open: `bg-duck-acid`
- Knoptekst onderstreepingsanimatie:
  ```html
  group-hover:scale-x-100 origin-left transition-transform duration-300
  ```

---

## Animaties

| Klasse | Duur | Gebruik |
|---|---|---|
| `animate-duck-float` | 7s ease-in-out infinite | Zwevendde elementen, hero |
| `animate-duck-float-delayed` | 7s + 2.4s delay | Tweede zweeflaag |
| `animate-duck-marquee` | 36s linear infinite | Horizontale merkenstrip |
| `animate-duck-spin-slow` | 16s linear infinite | Roterende labels/badges |
| `animate-duck-blink` | 5.2s ease-in-out infinite | Cursor-imitatie |
| `animate-duck-rise` | 0.85s cubic easing, forwards | Inkomend element van onder |

Regels:
- Respecteer `prefers-reduced-motion`: content blijft direct zichtbaar, animaties worden uitgeschakeld.
- Gebruik alleen `opacity` en `transform` — geen `filter`, geen `blur`, geen layout-animaties.
- Geen smooth-scroll override (geen Lenis); ankerlinks blijven werken.

---

## Logo en merk

- **DuckMark component:** `<DuckMark />` in `src/components/brand/DuckMark.tsx` — de primaire merkidentificatie.
- **Logo lockup:** `/logo-lockup.webp` — gebruikt op loginpagina en auth-schermen.
- Het merk is de eend-mascotte, niet de eerdere bever/otter. Gebruik geen otter/beaver-assets als primaire merkuitingen.
- DuckMark op 32px–64px leesbaar: groot silhouet, minimale details.

---

## Sectieopbouw (homepage)

1. **Hero:** Leerlingbelofte, twee CTA's, skill-kaarten-carrousel.
2. **Marquee-strip:** Horizontale lus met skill/merk-tekst.
3. **Skills:** Vijf DUCK-stijl skillkaarten met letter-watermerk, icon en beschrijving.
4. **Projecten / Missies:** Voorbeeldkaarten met echte DGSkills-screenshots.
5. **Voor scholen:** Propositie, SLO, privacy, onboarding.
6. **Footer CTA:** Donkere band (`bg-duck-ink`) met acid CTA-knop.

---

## Componentregels

- Organische vormen alleen op grote visuele assets en sectie-overgangen.
- Kaarten hebben `rounded-[1.6rem]` of `rounded-[1.75rem]` — geen kleinere waarden voor primaire kaarten.
- Doodles en decoratieve elementen krijgen `aria-hidden`.
- Icon-only buttons krijgen een `aria-label`.
- Alle interactieve doelen: minimaal `min-h-[44px]`.
- Nieuwe componenten gebruiken `duck-*` tokens; gebruik geen `lab-*` in nieuw te schrijven publieke of auth-componenten.

---

## Scope en transitiestatus

DUCK-tokens zijn de doelstijl voor het volledige platform. De migratie loopt:

| Gebied | Status |
|---|---|
| Publieke landing (`ScholenLanding.tsx`) | Duck-stijl — volledig |
| Auth-hoofdscherm (`Login.tsx`, `MfaGate.tsx`, `ChangePassword.tsx`) | Duck-stijl — volledig |
| Auth-subcomponent (`RoleCard.tsx`) | Lab-stijl — nog niet gemigreerd |
| Missies en AI-lab (gedeeltelijk) | Gemengd — duck-* en lab-* door elkaar |
| Overige app (dashboards, portfolio, teacher) | Grotendeels lab-stijl |

Schrijf nieuwe componenten altijd in `duck-*` stijl. `lab-*` tokens zijn legacy — gebruik ze niet in nieuwe code.
