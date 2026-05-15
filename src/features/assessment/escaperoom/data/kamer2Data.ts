// Kamer 2: Nepnieuwsfabriek — nepnieuws herkennen (true/false)
// v1 = nulmeting (in KamerNepnieuwsfabriek.tsx): telefoonverbod, robotleraar, game-verslaving, TikTok-wet, UNESCO AI
// v2 = eindmeting: andere onderwerpen, zelfde moeilijkheidsgraad, zelfde verhouding (2 echt / 3 nep)

export interface NieuwsBericht {
  id: string;
  titel: string;
  bron: string;
  tekst: string;
  hints: string[];
  isNep: boolean;
  uitleg: string;
}

export const BERICHTEN_V2: NieuwsBericht[] = [
  {
    id: 'n1',
    titel: 'Minecraft wordt verplicht vak op 30 Nederlandse scholen',
    bron: 'GamingGerucht.nl',
    tekst: 'Dertig basisscholen en middelbare scholen zijn verplicht om Minecraft elke week twee uur te geven. Kinderen die niet meedoen zakken automatisch voor het vak.',
    hints: ['Onbekende website', 'Geen vermelding van schoolnamen of regio', 'Onrealistische verplichting'],
    isNep: true,
    uitleg: 'Geen enkele officiële bron bevestigt dit. De website is onbekend, er worden geen scholen of namen genoemd en de bewering klopt inhoudelijk niet.',
  },
  {
    id: 'n2',
    titel: 'Kabinet wil chatapps voor kinderen onder 13 jaar verplicht beveiligen',
    bron: 'NOS',
    tekst: 'De minister van Digitalisering wil chatapps zoals WhatsApp en Snapchat verplichten extra beveiligingen in te voeren voor gebruikers jonger dan 13 jaar. Het plan wordt komend jaar naar de Tweede Kamer gestuurd.',
    hints: ['NOS is een betrouwbare nieuwsbron', 'Noemt concrete persoon en procedure', 'Aansluitend bij bestaand EU-beleid'],
    isNep: false,
    uitleg: 'Een realistisch en actueel bericht van een betrouwbare bron, met specifieke details over het beleidsproces.',
  },
  {
    id: 'n3',
    titel: 'BEWEZEN: schermtijd onder 1 uur per dag geeft je een IQ van boven de 140!!',
    bron: 'SlimmerLeven24.com',
    tekst: 'Wetenschappers in Amerika hebben aangetoond dat jongeren die minder dan één uur per dag naar een scherm kijken automatisch GENIEËN worden. Hun IQ stijgt met gemiddeld 60 punten in drie maanden!',
    hints: ['Onbekende website', 'Overdreven hoofdletters en uitroeptekens', 'Onrealistische wetenschappelijke claim'],
    isNep: true,
    uitleg: 'Dit is nepnieuws. De bewering is wetenschappelijk onmogelijk, de bron is onbekend en de taal is typisch clickbait.',
  },
  {
    id: 'n4',
    titel: 'Leerlingen gebruiken ChatGPT steeds vaker als huiswerkassistent',
    bron: 'Trouw',
    tekst: 'Uit een enquête van kennisinstituut Oberon onder 1.200 middelbare scholieren blijkt dat ruim de helft ChatGPT gebruikt bij het maken van huiswerk. Scholen zoeken naar manieren om dit te begeleiden.',
    hints: ['Trouw is een gerenommeerde krant', 'Specifiek onderzoeksinstituut en steekproefgrootte', 'Concrete, verifieerbare bewering'],
    isNep: false,
    uitleg: 'Een betrouwbaar bericht met een bekende bron, een concreet onderzoeksinstituut en realistische bevindingen.',
  },
  {
    id: 'n5',
    titel: 'Nieuwe app leest je dromen uit terwijl je slaapt via je WiFi-signaal',
    bron: 'TechAlert.biz',
    tekst: 'Een Amerikaans techbedrijf heeft een app gelanceerd die via je WiFi-router je hersengolven kan oppikken terwijl je slaapt. De app toont je dromen als filmpjes in de ochtend.',
    hints: ['Onbekende .biz-website', 'Technisch onmogelijke claim', 'Geen naam van het bedrijf of bewijs'],
    isNep: true,
    uitleg: 'WiFi-signalen kunnen geen hersengolven registreren. Er wordt geen bedrijfsnaam of bewijs gegeven. Typisch nepnieuws.',
  },
];
