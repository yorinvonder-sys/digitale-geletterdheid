# Tekstvoorstellen: klasgebonden toegang in de compliance-documenten

**Status:** voorstel — geen enkel bindend document is gewijzigd
**Datum:** 26 augustus 2026
**Hoort bij:** [`ontwerp-docent-klas-koppeling.md`](ontwerp-docent-klas-koppeling.md)
**Besluit bij:** Yorin, met juridische toetsing (`dgskills-jurist-check`)

---

## Waarom dit er ligt

**Acht bestanden** beschrijven klasgebonden toegang voor docenten. Het platform
werkt schoolbreed. Twee ervan — de beveiligingsbijlage en de privacybijsluiter —
gaan mee naar scholen en zijn onderdeel van de verwerkersafspraken. En twee
staan **publiek op de website**.

> **Toegevoegd na review (27 aug 2026).** De eerste versie van dit voorstel
> dekte vijf documenten. Een repo-brede sweep over álle publicatie-oppervlakken
> — dus ook `public/` en `src/` — bracht er drie bij, waaronder een gepubliceerde
> DPIA-ondersteuningspagina. Zie punt 0 hieronder; dat is nu het dringendste
> punt van dit hele dossier.

Zolang de toegangsregels niet zijn omgezet (stap 3-5 van het migratiepad) is de
tekst de enige kant die je eerlijk kunt bijstellen. Hieronder per document een
voorstel voor de tussenstand, en een voorstel voor de eindtekst zodra
`class_strict` draait.

Ik heb deze documenten bewust **niet** zelf aangepast: het zijn bindende stukken
en de keuze tussen "tekst bijstellen" en "eerst techniek afmaken" is een
zakelijke en juridische, geen technische.

---

## 0. Publieke DPIA-ondersteuningspagina — DRINGEND

`public/compliance/dpia-support-dgskills-v1.html`, regel 92, en het
byte-identieke `public/dev-docs/dpia-support-dgskills-v1.html`.

**Nu:**
> Strikt Rolgebaseerd Toegangsbeheer (RBAC) via Supabase Row Level Security
> (RLS). Alleen docenten van de eigen klas kunnen data inzien.

Dit staat als beheersmaatregel tegenover het risico "Ongeautoriseerde toegang
tot leerlingdata", op een pagina die publiek wordt geserveerd. Het is de enige
vindplaats van de claim buiten de interne documenten om, en daarmee de meest
bezwaarlijke: een school of ouder kan er vandaag op afgaan.

**Voorstel tussenstand:**
> Strikt Rolgebaseerd Toegangsbeheer (RBAC) via Supabase Row Level Security
> (RLS), met verplichte tweefactorauthenticatie voor docenten. Toegang is
> begrensd tot de eigen school; beperking tot de eigen klassen is technisch
> voorbereid en wordt per school ingeschakeld.

**Voorstel eindtekst (na `class_strict`):**
> Strikt Rolgebaseerd Toegangsbeheer (RBAC) via Supabase Row Level Security
> (RLS), met verplichte tweefactorauthenticatie. Docenten kunnen uitsluitend
> gegevens inzien van leerlingen in de klassen die aan hen zijn toegewezen.

Let op: beide bestanden zijn byte-identiek en moeten samen worden aangepast,
anders ontstaat er drift tussen twee gepubliceerde kopieën.

---

## 1. Verwerkingsregister V-06

`business/nl-vo/compliance/verwerkingsregister.md`, regel 164.

**Nu:**
> | **Technische maatregelen** | RLS; cascade-delete; docenten zien alleen eigen leerlingen |

**Voorstel tussenstand:**
> | **Technische maatregelen** | RLS (schoolgescoped: docenten hebben toegang tot leerlinggegevens binnen de eigen school, met verplichte MFA); cascade-delete. Klasgebonden toegangsbeperking is technisch voorbereid; de toegangsregels zijn nog niet omgezet. |

**Voorstel eindtekst (na `class_strict`):**
> | **Technische maatregelen** | RLS (klasgescoped: docenten hebben uitsluitend toegang tot leerlingen van de klassen die aan hen zijn toegewezen), verplichte MFA; cascade-delete |

---

## 2. Beveiligingsbijlage B — school-facing

`business/nl-vo/compliance/B-beveiligingsbijlage-dgskills.md`, regel 56.

**Nu:**
> | **Klasscoping** | Binnen een school zijn gegevens per klas gescheiden. Docenten zien uitsluitend hun eigen klassen. |

Dit is de scherpste formulering van de vijf en staat in een stuk dat scholen
ondertekenen. Prioriteit voor correctie.

**Voorstel tussenstand:**
> | **Schoolscoping** | Gegevens zijn per school gescheiden; een docent heeft geen toegang tot gegevens van een andere school. Binnen de school heeft een docent toegang tot leerlinggegevens na verplichte tweefactorauthenticatie. Klasgebonden beperking binnen de school is technisch voorbereid; zij is nog niet op de toegangsregels toegepast en dus nog niet actief. |

**Voorstel eindtekst:**
> | **Klasscoping** | Gegevens zijn per school gescheiden. Binnen een school ziet een docent uitsluitend de leerlingen van de klassen die de schoolbeheerder aan hem heeft toegewezen. De schoolbeheerder houdt schoolbreed inzicht. |

---

## 3. Privacybijsluiter E — school-facing

`business/nl-vo/compliance/E-privacybijsluiter-dgskills.md`, regel 66.

**Nu:**
> | **Docent** | Voortgang en activiteit van leerlingen in eigen klassen |

**Voorstel tussenstand:**
> | **Docent** | Voortgang en activiteit van leerlingen binnen de eigen school |

**Voorstel eindtekst:**
> | **Docent** | Voortgang en activiteit van leerlingen in de aan hem toegewezen klassen |
> | **Schoolbeheerder** | Voortgang en activiteit van alle leerlingen binnen de eigen school; beheert de koppeling docent-klas |

De regel voor de schoolbeheerder is nieuw. Die rol heeft schoolbreed zicht in
álle standen en dat hoort in het overzicht te staan.

---

## 4. DPIA — risico R08

`business/nl-vo/compliance/dpia-dgskills-compleet.md`, regels 102 en 258.

**Nu (regel 258):**
> | **R08** | **Ongeautoriseerde toegang door docent buiten eigen klas** — Docent ziet gegevens van leerlingen die niet tot zijn/haar klas behoren | Leerlingen | 2 | 2 | **4** | Laag |

De score "Laag" berust op een beheersmaatregel die niet bestond. De
waarschijnlijkheid is feitelijk 100%: het is geen risico maar de huidige
werking.

**Voorstel tussenstand:**
> | **R08** | **Toegang door docent buiten eigen klas** — Binnen een school heeft elke docent toegang tot de gegevens van elke leerling van die school. Beperking tot de eigen klassen is technisch voorbereid (koppeltabel `teacher_classes` + `is_teacher_of_student()`) maar op geen enkele toegangsregel toegepast; de maatregel is dus nog niet werkzaam. Beheersing loopt via schoolgrens, verplichte MFA, auditlogging en de verwerkersovereenkomst. | Leerlingen | 3 | 2 | **6** | Middel |

**Voorstel eindtekst:**
> | **R08** | **Toegang door docent buiten eigen klas** — Docent ziet uitsluitend leerlingen van toegewezen klassen; toewijzing uitsluitend door de schoolbeheerder, met spoor. | Leerlingen | 1 | 2 | **2** | Laag |

Regel 102 (`Toegang tot leerlinggegevens van eigen klas`) volgt dezelfde lijn:
tussenstand "Toegang tot leerlinggegevens binnen de eigen school", eindtekst
ongewijzigd.

De DPIA is een bindend document. Een wijziging in de risicoscore hoort langs de
FG voordat hij vaststaat.

---

## 5. Data-flow-overzicht (sjabloon)

`business/nl-vo/compliance/data-flow-overview-template.md`, regel 31.

**Nu:**
> | Docent | eigen klassen en voortgangsoverzichten | geen toegang buiten toegewezen groepen |

**Voorstel tussenstand:**
> | Docent | leerlingen binnen de eigen school | geen toegang buiten de eigen school |

**Voorstel eindtekst:** ongewijzigd laten — de huidige tekst beschrijft de
eindstand correct.

---

## 6. SEO-demopagina (klein)

`src/features/seo/SloRapport.tsx`, regel 195: "het rapport dat docenten en
ICT-coördinatoren binnen DGSkills zelf kunnen inzien voor hun eigen klassen."

Dit beschrijft een dashboardfilter, niet een toegangsmaatregel, en is daarmee
het minst bezwaarlijk van de acht. Het wordt vanzelf juist zodra `class_strict`
draait. Voorstel: nu laten staan; opnieuw bekijken bij de eindteksten.

---

## Volgorde van het besluit

1. **De twee publieke HTML-pagina's eerst** (punt 0). Die staan live en zijn de
   enige vindplaats buiten de interne stukken om. Samen aanpassen — ze zijn
   byte-identiek.
2. **Beveiligingsbijlage B en privacybijsluiter E.** Die gaan naar scholen; daar
   is het verschil tussen tekst en werkelijkheid contractueel bezwaarlijk.
3. **DPIA R08** vraagt een aparte ronde langs de FG vanwege de risicoscore.
4. **Verwerkingsregister en data-flow-sjabloon** kunnen mee in dezelfde ronde.
5. Zodra een school op `class_strict` draait: de eindteksten, met vermelding dat
   de stand per school verschilt zolang niet alle scholen zijn omgezet.

Dat laatste punt is de scherpste kant van dit dossier: zolang scholen in
verschillende standen draaien, kan één algemene tekst niet voor alle scholen
kloppen. Overweeg de stand per school vast te leggen in de
verwerkersovereenkomst of in een bijlage per school.

## Nog te beslissen door de FG

De voorgestelde herscore van R08 (van 2×2=4 "Laag" naar 3×2=6 "Middel") is een
inschatting, geen vaststelling. Het tegenargument is dat de *mogelijkheid* tot
toegang buiten de eigen klas nu systematisch aanwezig is — dat pleit voor een
hogere kans dan 3. De FG stelt de score vast, niet dit document.
