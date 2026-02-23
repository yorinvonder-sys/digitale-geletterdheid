
/**
 * SLO Kerndoelen Digitale Geletterdheid (VSO - Functionele Kerndoelen 2025)
 */

export type VsoProfile = 'dagbesteding' | 'arbeidsmarkt';

export type SloDomain = 
  | 'praktische_kennis_en_vaardigheden'
  | 'ontwerpen_en_maken'
  | 'de_gedigitaliseerde_wereld';

export interface SloBullet {
  id: string;
  text: string;
  level: 'ervaring' | 'beheersing' | 'hybride';
  vsoMapping: {
    dagbesteding: boolean;
    arbeidsmarkt: boolean;
  };
}

export interface SloGoalPart {
  id: string; // e.g., '18A', '18B'
  title: string;
  description: string;
  bullets: SloBullet[];
}

export interface SloGoal {
  id: number; // e.g., 18, 19, 20
  domain: SloDomain;
  title: string;
  parts: SloGoalPart[];
}

export const SLO_VSO_GOALS: SloGoal[] = [
  {
    id: 18,
    domain: 'praktische_kennis_en_vaardigheden',
    title: 'De leerling zet digitale technologie en digitale media in.',
    parts: [
      {
        id: '18A',
        title: 'Digitale systemen',
        description: 'De leerling zet digitale systemen functioneel in.',
        bullets: [
          { id: '18A.1', text: 'Bedienen/verkennen van verschillende digitale apparaten', level: 'hybride', vsoMapping: { dagbesteding: true, arbeidsmarkt: true } },
          { id: '18A.2', text: 'Kennis hebben van het doel en de taak van software', level: 'beheersing', vsoMapping: { dagbesteding: true, arbeidsmarkt: true } },
          { id: '18A.3', text: 'Gebruiken van softwaremogelijkheden in context (wonen, werken, vrije tijd)', level: 'beheersing', vsoMapping: { dagbesteding: true, arbeidsmarkt: true } },
          { id: '18A.4', text: 'Gebruiken van ondersteuningsmogelijkheden van digitale systemen', level: 'hybride', vsoMapping: { dagbesteding: true, arbeidsmarkt: true } },
          { id: '18A.5', text: 'Beheren van bestanden (ordenen, opslaan, opvragen)', level: 'beheersing', vsoMapping: { dagbesteding: false, arbeidsmarkt: true } }
        ]
      },
      {
        id: '18B',
        title: 'Digitale media en informatie',
        description: 'De leerling navigeert doelgericht/verkent het digitale media- en informatielandschap.',
        bullets: [
          { id: '18B.1', text: 'Vergelijken van media en bronnen op betrouwbaarheid', level: 'beheersing', vsoMapping: { dagbesteding: false, arbeidsmarkt: true } },
          { id: '18B.2', text: 'Hanteren van zoekstrategieën en zoekopdrachten', level: 'beheersing', vsoMapping: { dagbesteding: true, arbeidsmarkt: true } },
          { id: '18B.3', text: 'Beoordelen van informatie op bruikbaarheid', level: 'beheersing', vsoMapping: { dagbesteding: true, arbeidsmarkt: true } },
          { id: '18B.4', text: 'Herkennen van sturende technieken van makers', level: 'beheersing', vsoMapping: { dagbesteding: false, arbeidsmarkt: true } }
        ]
      },
      {
        id: '18C',
        title: 'Artificiële intelligentie (AI)',
        description: 'De leerling verkent AI.',
        bullets: [
          { id: '18C.1', text: 'Herkennen van AI-toepassingen in de eigen omgeving', level: 'ervaring', vsoMapping: { dagbesteding: true, arbeidsmarkt: true } },
          { id: '18C.2', text: 'Experimenteren met AI-systemen of hulpmiddelen', level: 'ervaring', vsoMapping: { dagbesteding: true, arbeidsmarkt: true } },
          { id: '18C.3', text: 'Verkennen hoe AI-gedrag lijkt op menselijk gedrag', level: 'ervaring', vsoMapping: { dagbesteding: false, arbeidsmarkt: true } }
        ]
      }
    ]
  },
  {
    id: 19,
    domain: 'ontwerpen_en_maken',
    title: 'De leerling creëert met digitale technologie.',
    parts: [
      {
        id: '19A',
        title: 'Creëren met digitale technologie',
        description: 'De leerling ontwerpt en maakt producten met digitale technologie.',
        bullets: [
          { id: '19A.1', text: 'Kiezen/verkennen van digitale middelen om te creëren', level: 'hybride', vsoMapping: { dagbesteding: true, arbeidsmarkt: true } },
          { id: '19A.2', text: 'Experimenteren met uiten van gedachten/gevoelens', level: 'ervaring', vsoMapping: { dagbesteding: true, arbeidsmarkt: true } },
          { id: '19A.3', text: 'Producten gericht op delen van informatie/boodschap', level: 'hybride', vsoMapping: { dagbesteding: true, arbeidsmarkt: true } },
          { id: '19A.4', text: 'Ontwerpen aan de hand van ontwerpeisen', level: 'beheersing', vsoMapping: { dagbesteding: false, arbeidsmarkt: true } },
          { id: '19A.5', text: 'Experimenteren met computationele denkstrategieën', level: 'ervaring', vsoMapping: { dagbesteding: false, arbeidsmarkt: true } }
        ]
      }
    ]
  },
  {
    id: 20,
    domain: 'de_gedigitaliseerde_wereld',
    title: 'De leerling participeert in de gedigitaliseerde wereld.',
    parts: [
      {
        id: '20A',
        title: 'Veiligheid en privacy',
        description: 'De leerling gaat veilig om met digitale systemen, data en privacy.',
        bullets: [
          { id: '20A.1', text: 'Herkennen van veiligheidsrisico’s', level: 'hybride', vsoMapping: { dagbesteding: true, arbeidsmarkt: true } },
          { id: '20A.2', text: 'Veilig gebruiken van systemen en data', level: 'beheersing', vsoMapping: { dagbesteding: true, arbeidsmarkt: true } },
          { id: '20A.3', text: 'Nemen van technische beschermingsmaatregelen', level: 'beheersing', vsoMapping: { dagbesteding: false, arbeidsmarkt: true } },
          { id: '20A.4', text: 'Wegen van dilemma’s bij delen van data', level: 'beheersing', vsoMapping: { dagbesteding: false, arbeidsmarkt: true } },
          { id: '20A.5', text: 'Omgaan met ongepaste content of gedrag', level: 'hybride', vsoMapping: { dagbesteding: true, arbeidsmarkt: true } }
        ]
      },
      {
        id: '20B',
        title: 'Digitale technologie, jezelf, de ander en de samenleving',
        description: 'De leerling maakt passende keuzes bij het gebruik van digitale technologie en media.',
        bullets: [
          { id: '20B.1', text: 'Online communiceren op respectvolle wijze', level: 'beheersing', vsoMapping: { dagbesteding: true, arbeidsmarkt: true } },
          { id: '20B.2', text: 'Omgaan met invloed op wonen, werken en vrije tijd', level: 'beheersing', vsoMapping: { dagbesteding: true, arbeidsmarkt: true } },
          { id: '20B.3', text: 'Rekening houden met fysieke en mentale gezondheid', level: 'beheersing', vsoMapping: { dagbesteding: true, arbeidsmarkt: true } },
          { id: '20B.4', text: 'Kiezen wat je online over jezelf/anderen deelt', level: 'beheersing', vsoMapping: { dagbesteding: true, arbeidsmarkt: true } },
          { id: '20B.5', text: 'Verkennen van eigen interesses in tech/media', level: 'beheersing', vsoMapping: { dagbesteding: true, arbeidsmarkt: true } }
        ]
      }
    ]
  }
];
