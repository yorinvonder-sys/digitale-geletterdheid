// Kamer 1: Vergrendelde Laptop — bestandsbeheer (drag-drop)
// v1 = nulmeting (bestaande vragen in KamerVergrendeldeLaptop.tsx)
// v2 = eindmeting (nieuwe bestanden, zelfde categorieën)

export interface BestandItem {
  id: string;
  naam: string;
  type: 'document' | 'afbeelding' | 'spreadsheet' | 'presentatie';
}

export interface MapTarget {
  id: string;
  naam: string;
  accepteert: string[];
}

export const BESTANDEN_V2: BestandItem[] = [
  { id: 'b1', naam: 'Verslag_Geschiedenis.docx', type: 'document' },
  { id: 'b2', naam: 'Schoolkamp_groepsfoto.jpg', type: 'afbeelding' },
  { id: 'b3', naam: 'Boekenlijst_scores.xlsx', type: 'spreadsheet' },
  { id: 'b4', naam: 'Project_Duurzaamheid.pptx', type: 'presentatie' },
  { id: 'b5', naam: 'Portretfoto_pasfoto.png', type: 'afbeelding' },
  { id: 'b6', naam: 'Brief_aan_mentor.pdf', type: 'document' },
  { id: 'b7', naam: 'Resultaten_enquete.xlsx', type: 'spreadsheet' },
  { id: 'b8', naam: 'Eindpresentatie_Engels.pptx', type: 'presentatie' },
];

// Mappen zijn identiek aan v1 (zelfde categorieën, andere bestandsinhoud)
export const MAPPEN_V2: MapTarget[] = [
  { id: 'm1', naam: 'Documenten', accepteert: ['document'] },
  { id: 'm2', naam: 'Afbeeldingen', accepteert: ['afbeelding'] },
  { id: 'm3', naam: 'Spreadsheets', accepteert: ['spreadsheet'] },
  { id: 'm4', naam: 'Presentaties', accepteert: ['presentatie'] },
];
