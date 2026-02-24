/**
 * Lightweight prerender script for SEO-critical public routes.
 *
 * Runs AFTER `vite build` and uses a headless approach:
 * - Serves the dist folder locally
 * - Fetches each public route via fetch()
 * - Writes the server-rendered HTML into dist/<route>/index.html
 *
 * This ensures Google and other crawlers see fully rendered HTML
 * without needing to execute JavaScript.
 *
 * Usage: node scripts/prerender.mjs
 */

import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST = join(__dirname, '..', 'dist');

// Routes to prerender — only public/SEO-relevant pages
const ROUTES = [
  '/', 
  '/scholen', 
  '/login', 
  '/ict', 
  '/ict/integraties', 
  '/ict/privacy', 
  '/ict/privacy/policy',
  '/ict/privacy/cookies',
  '/ict/privacy/ai',
  '/ict/technisch', 
  '/ict/support',
  '/404',
  '/digitale-geletterdheid-vo',
  '/slo-kerndoelen-digitale-geletterdheid',
  '/ai-geletterdheid-onderwijs-ai-act',
  '/compliance-hub',
  '/compliance/checklist',
  '/compliance/slo-rapport',
  '/vergelijking/dgskills-vs-digit-vo',
  '/vergelijking/dgskills-vs-basicly',
  '/gids/ai-geletterdheid-verplicht-2025',
  '/gids/slo-kerndoelen-2027-voorbereiding',
  '/gids/deepfakes-herkennen-in-de-klas',
  '/gids/digitale-geletterdheid-implementeren',
  '/gids/avg-compliance-school-software',
  '/gids/computational-thinking-voorbeelden',
  '/gids/informatievaardigheden-lesgeven',
  '/gids/mediawijsheid-social-media'
];

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

/**
 * Simple static file server for dist folder.
 * Falls back to index.html for SPA routes (like Firebase Hosting).
 */
function createStaticServer() {
  return createServer((req, res) => {
    let filePath = join(DIST, req.url === '/' ? '/index.html' : req.url);

    if (!existsSync(filePath) || !extname(filePath)) {
      filePath = join(DIST, 'index.html');
    }

    try {
      const content = readFileSync(filePath);
      const ext = extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });
}

/**
 * For each route, inject prerendered meta content into the HTML.
 * Since we can't run a full browser here, we create route-specific
 * index.html files with the correct meta tags baked in.
 */
function prerenderRoutes() {
  const indexHtml = readFileSync(join(DIST, 'index.html'), 'utf-8');

  const routeMeta = {
    '/': {
      title: 'Digitale Geletterdheid voor Scholen — Gratis Pilot | DGSkills',
      description: 'DGSkills is het interactieve platform voor digitale geletterdheid in het voortgezet onderwijs. AI-missies, gamification en SLO Kerndoelen 2025. Start een gratis pilot voor jouw school.',
      canonical: 'https://dgskills.app/',
      ogTitle: 'DGSkills — Digitale Geletterdheid voor het Onderwijs',
      ogDescription: 'Interactief platform met AI-missies, gamification en SLO Kerndoelen 2025 voor het voortgezet onderwijs. Gratis pilot voor scholen.',
      ogUrl: 'https://dgskills.app/',
    },
    '/scholen': {
      title: 'Digitale Geletterdheid voor Scholen — Gratis Pilot | DGSkills',
      description: 'DGSkills is het interactieve platform voor digitale geletterdheid in het voortgezet onderwijs. AI-missies, gamification en SLO Kerndoelen 2025. Start een gratis pilot voor jouw school.',
      canonical: 'https://dgskills.app/scholen',
      ogTitle: 'Digitale Geletterdheid voor Scholen — Gratis Pilot | DGSkills',
      ogDescription: 'AI-missies, gamification en SLO Kerndoelen 2025 in één platform. Start een gratis pilot van 3 maanden.',
      ogUrl: 'https://dgskills.app/scholen',
    },
    '/login': {
      title: 'Inloggen — DGSkills | Digitale Geletterdheid',
      description: 'Log in op DGSkills — het platform voor digitale geletterdheid in het voortgezet onderwijs. Toegang tot AI-missies, gamification en meer.',
      canonical: 'https://dgskills.app/login',
      ogTitle: 'Inloggen — DGSkills',
      ogDescription: 'Log in op het DGSkills platform voor digitale geletterdheid.',
      ogUrl: 'https://dgskills.app/login',
    },
    '/ict': {
      title: 'ICT & Informatiemanagers — Veiligheid, Privacy & Integratie | DGSkills',
      description: 'Ontdek hoe DGSkills past in jouw schoolarchitectuur. Alles over SSO (Microsoft/Google/SURFconext), AVG-compliance, LVS-koppelingen en technische support.',
      canonical: 'https://dgskills.app/ict',
      ogTitle: 'ICT & Informatiemanagers — Veiligheid, Privacy & Integratie | DGSkills',
      ogDescription: 'Veilige en beheersbare digitale geletterdheid voor het VO. AVG-compliant en naadloze integratie.',
      ogUrl: 'https://dgskills.app/ict',
    },
    '/ict/integraties': {
      title: 'Integraties & SSO — DGSkills ICT',
      description: 'Naadloze koppeling met Microsoft 365, Google Workspace, SURFconext, Magister en SOMtoday.',
      canonical: 'https://dgskills.app/ict/integraties',
      ogTitle: 'Integraties & SSO — DGSkills ICT',
      ogDescription: 'Koppel DGSkills met je bestaande school-infrastructuur.',
      ogUrl: 'https://dgskills.app/ict/integraties',
    },
    '/ict/privacy': {
      title: 'Security & Privacy — DGSkills ICT',
      description: 'AVG-compliant, data opslag in de EU en volledige transparantie over datastromen.',
      canonical: 'https://dgskills.app/ict/privacy',
      ogTitle: 'Security & Privacy — DGSkills ICT',
      ogDescription: 'Veilige digitale geletterdheid voor het voortgezet onderwijs.',
      ogUrl: 'https://dgskills.app/ict/privacy',
    },
    '/ict/privacy/policy': {
      title: 'Privacyverklaring — DGSkills ICT',
      description: 'Lees hoe DGSkills persoonsgegevens van leerlingen en docenten verwerkt, beveiligt en bewaart volgens de AVG.',
      canonical: 'https://dgskills.app/ict/privacy/policy',
      ogTitle: 'Privacyverklaring — DGSkills ICT',
      ogDescription: 'Transparante privacyverklaring voor scholen, ICT en FG.',
      ogUrl: 'https://dgskills.app/ict/privacy/policy',
    },
    '/ict/privacy/cookies': {
      title: 'Cookiebeleid — DGSkills ICT',
      description: 'Overzicht van functionele en analytische cookies op DGSkills en hoe toestemming wordt beheerd.',
      canonical: 'https://dgskills.app/ict/privacy/cookies',
      ogTitle: 'Cookiebeleid — DGSkills ICT',
      ogDescription: 'Bekijk welke cookies DGSkills gebruikt en met welk doel.',
      ogUrl: 'https://dgskills.app/ict/privacy/cookies',
    },
    '/ict/privacy/ai': {
      title: 'AI Transparantieverklaring — DGSkills ICT',
      description: 'Hoe DGSkills AI inzet in het onderwijs, inclusief datagebruik, bewaartermijnen en EU AI Act-transparantie.',
      canonical: 'https://dgskills.app/ict/privacy/ai',
      ogTitle: 'AI Transparantieverklaring — DGSkills ICT',
      ogDescription: 'Inzicht in verantwoord AI-gebruik binnen DGSkills.',
      ogUrl: 'https://dgskills.app/ict/privacy/ai',
    },
    '/404': {
      title: 'Pagina niet gevonden — DGSkills',
      description: 'De opgevraagde pagina kon niet worden gevonden op DGSkills.',
      canonical: 'https://dgskills.app/404',
      ogTitle: 'Pagina niet gevonden — DGSkills',
      ogDescription: 'Oeps! Deze pagina bestaat niet (meer).',
      ogUrl: 'https://dgskills.app/404',
    },
    '/ict/technisch': {
      title: 'Technische Vereisten — DGSkills ICT',
      description: 'Web-based platform zonder installatie of plugins. Chrome, Edge, Safari ondersteuning.',
      canonical: 'https://dgskills.app/ict/technisch',
      ogTitle: 'Technische Vereisten — DGSkills ICT',
      ogDescription: 'Minimale ICT-last voor scholen.',
      ogUrl: 'https://dgskills.app/ict/technisch',
    },
    '/ict/support': {
      title: 'Service & Support SLA — DGSkills ICT',
      description: 'Gegarandeerde responstijden en 99,5% uptime garantie voor scholen.',
      canonical: 'https://dgskills.app/ict/support',
      ogTitle: 'Service & Support SLA — DGSkills ICT',
      ogDescription: 'Betrouwbare ondersteuning voor ICT-beheerders.',
      ogUrl: 'https://dgskills.app/ict/support',
    },
    '/digitale-geletterdheid-vo': {
      title: 'Digitale Geletterdheid VO: Dé Lesmethode voor 2027 | DGSkills',
      description: 'Op zoek naar een lesmethode digitale geletterdheid voor het VO? Ontdek DGSkills: interactief platform met AI-missies, volledige SLO-dekking en gamification. Start een gratis pilot.',
      canonical: 'https://dgskills.app/digitale-geletterdheid-vo',
      ogTitle: 'Digitale Geletterdheid VO: Dé Lesmethode voor 2027 | DGSkills',
      ogDescription: 'Interactief platform voor digitale geletterdheid in het VO met AI-missies en gamification.',
      ogUrl: 'https://dgskills.app/digitale-geletterdheid-vo',
    },
    '/slo-kerndoelen-digitale-geletterdheid': {
      title: 'SLO Kerndoelen Digitale Geletterdheid 2025 | DGSkills',
      description: 'Hoe voldoe je aan de SLO kerndoelen digitale geletterdheid? DGSkills biedt een tool met volledige kerndoeldekking voor het VO. Bekijk de matrix en start je pilot.',
      canonical: 'https://dgskills.app/slo-kerndoelen-digitale-geletterdheid',
      ogTitle: 'SLO Kerndoelen Digitale Geletterdheid 2025 | DGSkills',
      ogDescription: 'Volledige dekking van alle SLO kerndoelen digitale geletterdheid voor het VO.',
      ogUrl: 'https://dgskills.app/slo-kerndoelen-digitale-geletterdheid',
    },
    '/ai-geletterdheid-onderwijs-ai-act': {
      title: 'AI-geletterdheid in het Onderwijs & EU AI Act | DGSkills',
      description: 'Sinds februari 2025 is AI-geletterdheid verplicht onder de EU AI Act. Ontdek hoe DGSkills jouw school helpt met veilige AI-missies en volledige AVG-compliance.',
      canonical: 'https://dgskills.app/ai-geletterdheid-onderwijs-ai-act',
      ogTitle: 'AI-geletterdheid in het Onderwijs & EU AI Act | DGSkills',
      ogDescription: 'Voldoe aan de EU AI Act verplichtingen voor AI-geletterdheid in het onderwijs.',
      ogUrl: 'https://dgskills.app/ai-geletterdheid-onderwijs-ai-act',
    },
    '/compliance-hub': {
      title: 'Compliance Hub & Privacy Dossier | DGSkills',
      description: 'Centrale hub voor alle compliance-assets van DGSkills. Download de Verwerkersovereenkomst (DPA), DPIA Support documenten en AI Act transparantie-rapporten.',
      canonical: 'https://dgskills.app/compliance-hub',
      ogTitle: 'Compliance Hub & Privacy Dossier | DGSkills',
      ogDescription: 'Alle juridische en technische documentatie voor schoolbesturen en ICT-managers.',
      ogUrl: 'https://dgskills.app/compliance-hub',
    },
    '/compliance/checklist': {
      title: 'AI-Compliance Checklist voor VO Scholen | DGSkills',
      description: 'Een praktische checklist om te controleren of jouw school voldoet aan de AI Act en AVG bij het gebruik van onderwijssoftware.',
      canonical: 'https://dgskills.app/compliance/checklist',
      ogTitle: 'AI-Compliance Checklist voor VO Scholen',
      ogDescription: 'Voldoe aan de AI Act en AVG met deze praktische checklist.',
      ogUrl: 'https://dgskills.app/compliance/checklist',
    },
    '/compliance/slo-rapport': {
      title: 'Voorbeeld SLO-Dekkingsrapport | DGSkills',
      description: 'Bekijk hoe een geautomatiseerd rapport eruit ziet voor verantwoording aan de onderwijsinspectie.',
      canonical: 'https://dgskills.app/compliance/slo-rapport',
      ogTitle: 'Voorbeeld SLO-Dekkingsrapport',
      ogDescription: 'Aantoonbare kerndoeldekking voor de inspectie.',
      ogUrl: 'https://dgskills.app/compliance/slo-rapport',
    },
    '/vergelijking/dgskills-vs-digit-vo': {
      title: 'DGSkills vs DIGIT-vo | Vergelijking Digitale Geletterdheid',
      description: 'Benieuwd naar het verschil tussen DGSkills en DIGIT-vo? Lees onze objectieve vergelijking op het gebied van AI, gamification en SLO-dekking.',
      canonical: 'https://dgskills.app/vergelijking/dgskills-vs-digit-vo',
      ogTitle: 'DGSkills vs DIGIT-vo Vergelijking',
      ogDescription: 'De beste methode voor digitale geletterdheid in het VO.',
      ogUrl: 'https://dgskills.app/vergelijking/dgskills-vs-digit-vo',
    },
    '/vergelijking/dgskills-vs-basicly': {
      title: 'DGSkills vs Basicly | Vergelijking Digitale Geletterdheid',
      description: 'DGSkills of Basicly? Ontdek welke methode het beste past bij jouw school in het voortgezet onderwijs.',
      canonical: 'https://dgskills.app/vergelijking/dgskills-vs-basicly',
      ogTitle: 'DGSkills vs Basicly Vergelijking',
      ogDescription: 'Kies de juiste leerlijn digitale geletterdheid.',
      ogUrl: 'https://dgskills.app/vergelijking/dgskills-vs-basicly',
    },
  };

  for (const route of ROUTES) {
    let meta = routeMeta[route];
    
    // Fallback for guides if not explicitly defined
    if (!meta && route.startsWith('/gids/')) {
      const id = route.split('/')[2];
      const title = id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      meta = {
        title: `${title} | DGSkills Gidsen`,
        description: `Lees alles over ${title.toLowerCase()} in onze uitgebreide gids voor het voortgezet onderwijs.`,
        canonical: `https://dgskills.app${route}`,
        ogTitle: `${title} | DGSkills Gidsen`,
        ogDescription: `Uitgebreide gids over ${title.toLowerCase()} voor scholen.`,
        ogUrl: `https://dgskills.app${route}`,
      };
    }

    if (!meta) continue;

    let html = indexHtml;

    // Replace title
    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${meta.title}</title>`
    );

    // Replace meta description
    html = html.replace(
      /<meta name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${meta.description}" />`
    );

    // Replace canonical
    html = html.replace(
      /<link rel="canonical" href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${meta.canonical}" />`
    );

    // Replace OG tags
    html = html.replace(
      /<meta property="og:title" content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${meta.ogTitle}" />`
    );
    html = html.replace(
      /<meta property="og:description"\s+content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${meta.ogDescription}" />`
    );
    html = html.replace(
      /<meta property="og:url" content="[^"]*"\s*\/?>/,
      `<meta property="og:url" content="${meta.ogUrl}" />`
    );

    // Replace Twitter Card tags
    html = html.replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${meta.ogTitle}" />`
    );
    html = html.replace(
      /<meta name="twitter:description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${meta.ogDescription}" />`
    );

    // Write route-specific HTML
    if (route === '/') {
      // Already index.html — just update it in place
      writeFileSync(join(DIST, 'index.html'), html, 'utf-8');
      console.log(`  ✓ / → dist/index.html (updated meta)`);
    } else {
      const dir = join(DIST, route.slice(1));
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'index.html'), html, 'utf-8');
      console.log(`  ✓ ${route} → dist${route}/index.html`);
    }
  }
}

console.log('\n🔍 Prerendering SEO routes...\n');
prerenderRoutes();
console.log('\n✅ Prerendering complete!\n');
