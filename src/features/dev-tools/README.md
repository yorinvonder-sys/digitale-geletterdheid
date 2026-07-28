# Dev Tools

Deze folder bevat previewschermen waarmee ontwikkelaars losse onderdelen kunnen bekijken zonder de volledige app-flow te doorlopen: avatars, missies, de nulmeting, de app-shell en het designsysteem.

Belangrijke ingangen:

- `DesignPreview.tsx`
- `DevAvatarPreview.tsx`
- `DevMissionPreview.tsx`
- `DevNulmetingPreview.tsx`
- `DevShellPreview.tsx`
- `src/app/AppRouter.tsx`

Deze schermen hangen aan eigen routes in `src/app/AppRouter.tsx` en zijn bedoeld voor ontwikkeling, niet voor leerlingen of docenten. Controleer bij wijzigingen dat ze niet bereikbaar worden vanuit de authenticated shell en dat er geen echte leerlingdata in een preview terechtkomt.
