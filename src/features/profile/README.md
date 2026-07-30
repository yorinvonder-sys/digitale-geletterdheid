# Profile

Deze folder bevat het gebruikersprofiel, de toegankelijkheidsinstellingen en de volledige avatarketen: instellen, weergeven in 2D en 3D, en lazy laden.

Belangrijke ingangen:

- `UserProfile.tsx`
- `AccessibilityPanel.tsx`
- `avatar/AvatarSetup.tsx`
- `avatar/AvatarViewer.tsx`
- `avatar/LazyAvatarViewer.tsx`
- `src/config/avatarCatalog.ts`

`avatar/AvatarViewer.tsx` is met ruim 2000 regels het grootste bestand hier; begin bij `avatar/LazyAvatarViewer.tsx` als je alleen wilt weten hoe de avatar geladen wordt. De 3D-weergave is bewust lazy: laad die niet eager, dat kost bundlegrootte op elke route.

`AccessibilityPanel.tsx` raakt instellingen waar leerlingen van afhankelijk kunnen zijn. Test wijzigingen met toetsenbordbediening en met de instellingen daadwerkelijk aan.
