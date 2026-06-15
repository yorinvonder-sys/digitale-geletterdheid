# Prompt Voor Claude: DGSkills Duck Logo Correct Implementeren

Gebruik de assets in deze map als bron voor de DGSkills duck branding:

- `claude-assets/dgskills-duck-brand/logo.webp`
- `claude-assets/dgskills-duck-brand/logo-lockup.webp`
- `claude-assets/dgskills-duck-brand/dgskills-duck-logo-mark.webp`
- `claude-assets/dgskills-duck-brand/dgskills-duck-guide-v3.png`
- `claude-assets/dgskills-duck-brand/favicon-32.webp`
- `claude-assets/dgskills-duck-brand/apple-touch-icon.webp`
- `claude-assets/dgskills-duck-brand/icon-192x192.webp`
- `claude-assets/dgskills-duck-brand/icon-512x512.webp`
- `claude-assets/dgskills-duck-brand/ui-icons/dgskills-duck-default.webp`
- `claude-assets/dgskills-duck-brand/ui-icons/dgskills-duck-neutral.webp`
- `claude-assets/dgskills-duck-brand/ui-icons/dgskills-duck-happy.webp`
- `claude-assets/dgskills-duck-brand/ui-icons/dgskills-duck-surprised.webp`

Implementeer dit correct op de website:

1. Gebruik `logo-lockup.webp` voor brede brand lockups, zoals login header, publieke header en plekken waar tekst + logo samen horen.
2. Gebruik `logo.webp` of `dgskills-duck-logo-mark.webp` voor compacte merkplekken, favicon-achtige marks, icon buttons en dashboard brand marks.
3. Gebruik `dgskills-duck-guide-v3.png` alleen als grote mascot/illustratie/background-element. Niet gebruiken als favicon of compact logo.
4. Gebruik de `ui-icons/*` varianten waar nu smiley/emoji-face placeholders staan:
   - default/cool/general: `dgskills-duck-default.webp`
   - neutral: `dgskills-duck-neutral.webp`
   - happy/positive: `dgskills-duck-happy.webp`
   - surprised/curious: `dgskills-duck-surprised.webp`
5. Zorg dat alle logo/favicon assets transparante WebP blijven. Geen witte of zwarte achtergrond toevoegen.
6. Houd de bestaande publieke URL's stabiel waar mogelijk:
   - `/logo.webp`
   - `/logo-lockup.webp`
   - `/favicon-32.webp`
   - `/apple-touch-icon.webp`
   - `/icon-192x192.webp`
   - `/icon-512x512.webp`
   - `/assets/brand/dgskills-duck-logo-mark.webp`
   - `/assets/brand/dgskills-duck-guide-v3.png`
   - `/assets/brand/ui-icons/...`
7. Vervang oude verwijzingen naar bever/otter assets, `logo.svg`, `logo-lockup.svg`, `favicon.svg`, en smiley face icons waar die als brand placeholder gebruikt werden.
8. Update alt-teksten naar Nederlands, bijvoorbeeld `DGSkills eend`, `DGSkills logo`, of contextspecifiek. Decoratieve icons mogen `alt=""` gebruiken.
9. Vermijd grote mascot-crops op login/backgrounds: gebruik `object-contain`, lage opacity, en positioneer de duck rustig zodat het formulier leesbaar blijft.
10. Draai daarna:
    - `npm run doctor`
    - een scan op oude refs zoals `logo.svg`, `logo-lockup.svg`, `favicon.svg`, `beaver`, `otter`, `Smile`, `Laugh`, `Meh`, `😊`, `🙂`, `😮`, `😎`
    - een localhost check op `http://localhost:5173/`

Belangrijk: raak geen auth-, Supabase-, payment-, admin- of persoonlijke-data-logica aan. Dit is alleen een branding/asset rollout.
