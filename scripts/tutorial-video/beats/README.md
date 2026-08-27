# Draaiboeken voor de instructievideo's

Eén bestand per rol. Elk draaiboek is een lijst "beats": een gesproken zin plus
wat er op dat moment op het scherm gebeurt.

Diezelfde lijst voedt drie dingen tegelijk, zodat ze niet uit elkaar kunnen lopen:

1. de **voice-over** (`narrate.mjs` stuurt `narration` naar de stem)
2. de **timing van de opname** (`record.mjs` houdt elke beat exact zo lang aan
   als het bijbehorende audiofragment duurt)
3. de **ondertitels** (`assemble.mjs` schrijft `narration` met de gemeten
   tijdstempels naar een `.vtt`-bestand)

## Een beat

```js
{
    id: 'missies',                       // uniek, komt terug in bestandsnamen
    narration: 'Dit zijn je opdrachten.',// wat de stem zegt
    action: async (s) => {               // optioneel; wat er ondertussen gebeurt
        await s.wijsAan('[data-tutorial="student-main-missions"]');
    },
    pauzeNa: 400,                        // stilte erna in ms (default 350)
}
```

## Wat `action` krijgt

| Aanroep | Doet |
|---|---|
| `s.wijsAan(selector)` | Muis ernaartoe bewegen en een aandachtsring eromheen zetten |
| `s.klik(selector)` | Ernaartoe bewegen, klikken (de ring blijft even staan) |
| `s.scrollNaar(selector)` | In beeld scrollen zonder aan te wijzen |
| `s.ringWeg()` | Aandachtsring verwijderen |
| `s.wacht(ms)` | Even niets |
| `s.page` | De ruwe Playwright-pagina, voor uitzonderingen |

## Regels

- **Geen echte leerlingnamen.** De opname draait op de demo-fixtures; het script
  faalt hard als het een naam tegenkomt die daar niet in staat.
- **Selectors zijn `data-tutorial`-sleutels**, dezelfde als de klikrondleiding.
  De test `tests/onboarding/tour-targets.test.ts` bewaakt dat die blijven bestaan.
- **Houd zinnen kort.** Eén gedachte per beat; dat leest prettiger voor en maakt
  de ondertitels leesbaar.
