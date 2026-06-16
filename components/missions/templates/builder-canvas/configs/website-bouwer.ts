import type { BuilderCanvasConfig } from '../BuilderCanvas';

export const websiteBouwerConfig: BuilderCanvasConfig = {
    missionId: 'website-bouwer',
    title: 'Website Bouwer',
    introEmoji: '🌐',
    introTitle: 'Bouw je eerste website',
    introDescription:
        'In deze missie leer je hoe echte websites worden gemaakt. Je typt je eerste HTML-code, voegt stijl toe met CSS en bouwt een persoonlijke "Over Mij"-pagina — geen drag-and-drop, maar echte code die je zelf schrijft.',
    introFeatures: [
        'Schrijf je eerste HTML-structuur met tags',
        'Voeg kleur en stijl toe met CSS',
        'Bouw een persoonlijk profiel met afbeeldingsplek',
        'Begrijp hoe browsers je code omzetten naar een webpagina',
    ],
    enableChat: true,
    chatRoleId: 'website-bouwer',
    previewType: 'text-preview',
    steps: [
        {
            id: 'html-basis',
            title: 'HTML-structuur opzetten',
            description:
                'Elke website begint met een HTML-bestand. HTML vertelt de browser wat er op de pagina staat: een titel, tekst, een afbeelding. Zonder HTML bestaat er geen website.',
            instruction:
                'Schrijf de basisstructuur van een HTML-pagina. Je hebt nodig: `<!DOCTYPE html>`, `<html>`, `<head>` met een `<title>`, en `<body>`. Voeg in de body een `<h1>` toe met jouw naam als paginatitel en een `<p>` met een zin over jezelf. Schrijf de code uit alsof je hem echt in een bestand zou typen.',
            tip: 'Tags werken in paren: elke `<h1>` heeft een `</h1>`. Vergeet de sluit-tag niet, anders "lekt" je code.',
            checklistItems: [
                { id: 'doctype', label: 'Mijn code begint met <!DOCTYPE html>' },
                { id: 'head-title', label: 'Ik heb een <title> in de <head> gezet' },
                { id: 'h1-naam', label: 'In de <body> staat een <h1> met mijn naam' },
                { id: 'paragraaf', label: 'Ik heb een <p> toegevoegd met een zin over mezelf' },
            ],
            textPrompt: 'Schrijf hier je HTML-basisstructuur',
        },
        {
            id: 'css-stijl',
            title: 'Stijl toevoegen met CSS',
            description:
                'CSS (Cascading Style Sheets) bepaalt hoe je pagina eruitziet: kleuren, lettergrootte, achtergrond. Zonder CSS is elke website een kale zwart-witte pagina.',
            instruction:
                'Voeg een `<style>`-blok toe in je `<head>`. Geef de `body` een achtergrondkleur naar keuze. Maak de `h1` in een andere kleur dan de standaard zwart. Pas de lettergrootte van je `<p>` aan naar 18px. Noteer alle drie de CSS-regels met bijbehorende waarden.',
            tip: 'CSS-regels schrijf je zo: `selector { eigenschap: waarde; }`. Elke regel eindigt met een puntkomma.',
            checklistItems: [
                { id: 'style-blok', label: 'Ik heb een <style>-blok in de <head>' },
                { id: 'achtergrond', label: 'De body heeft een achtergrondkleur' },
                { id: 'h1-kleur', label: 'De h1 heeft een andere kleur dan zwart' },
                { id: 'fontsize', label: 'De paragraaf heeft font-size: 18px' },
            ],
            textPrompt: 'Schrijf hier je CSS-regels',
        },
        {
            id: 'content',
            title: 'Persoonlijke inhoud bouwen',
            description:
                'Een "Over Mij"-pagina vertelt iets echts over jou. Goede webpagina\'s combineren tekst met structuur: kopjes, lijsten en een plek voor een foto.',
            instruction:
                'Voeg aan je pagina toe: een tweede kopje (`<h2>`) met "Mijn hobbys", een ongeordende lijst (`<ul>`) met minimaal 3 hobbys als `<li>`-items, en een `<img>`-tag met een plaatshouder (je kunt `src="foto.jpg"` gebruiken). Voeg ook een `alt`-attribuut toe aan de afbeelding.',
            tip: 'Het `alt`-attribuut is niet optioneel: het beschrijft de afbeelding voor mensen die hem niet kunnen zien. Altijd invullen!',
            checklistItems: [
                { id: 'h2-hobbys', label: 'Ik heb een <h2> "Mijn hobbys" toegevoegd' },
                { id: 'lijst', label: 'Ik heb een <ul> met minimaal 3 <li>-items' },
                { id: 'img-tag', label: 'Ik heb een <img>-tag toegevoegd' },
                { id: 'alt', label: 'De afbeelding heeft een alt-attribuut' },
            ],
            textPrompt: 'Schrijf hier de HTML voor je persoonlijke sectie',
        },
        {
            id: 'reflectie',
            title: 'Uitleggen wat je hebt gebouwd',
            description:
                'Een goede developer kan niet alleen code schrijven, maar ook uitleggen hoe het werkt. Dit is een essentiële vaardigheid — in teamprojecten maar ook bij presentaties.',
            instruction:
                'Schrijf een korte uitleg (3-5 zinnen) van je pagina. Leg uit: wat doet HTML, wat doet CSS, en wat is het verschil tussen de twee? Geef ook aan welk onderdeel je het lastigst vond en waarom.',
            tip: 'Doe alsof je het uitlegt aan een jongere broer of zus die nog nooit van HTML heeft gehoord. Simpel taalgebruik = echte begrip.',
            checklistItems: [
                { id: 'html-uitleg', label: 'Ik heb uitgelegd wat HTML doet' },
                { id: 'css-uitleg', label: 'Ik heb uitgelegd wat CSS doet' },
                { id: 'verschil', label: 'Ik heb het verschil tussen HTML en CSS benoemd' },
                { id: 'lastig', label: 'Ik heb vermeld wat ik het lastigst vond' },
            ],
            textPrompt: 'Schrijf je uitleg hier',
        },
    ],
    maxScore: 100,
    badges: [
        { minScore: 90, emoji: '🏆', title: 'Web Wizard', color: '#D7C95F' },
        { minScore: 70, emoji: '🌐', title: 'Frontend Developer', color: '#5F947D' },
        { minScore: 50, emoji: '💻', title: 'Code Beginner', color: '#D97848' },
        { minScore: 25, emoji: '💡', title: 'Beginnende Webbouwer', color: '#0B453F' },
        { minScore: 0, emoji: '🌱', title: 'Op weg', color: '#445865' },
    ],
    takeaways: [
        'Je begrijpt wat HTML is en hoe je er een basiswebpagina mee bouwt',
        'Je weet hoe CSS werkt en hoe je kleur, lettertype en achtergrond aanpast',
        'Je kent de meest gebruikte HTML-tags: h1, h2, p, ul, li, img',
        'Je weet wat het alt-attribuut doet en waarom het belangrijk is',
        'Je kunt uitleggen wat het verschil is tussen structuur (HTML) en stijl (CSS)',
    ],
};

export default websiteBouwerConfig;
