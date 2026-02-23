import React from 'react';
import { ArrowLeft, Sparkles, ShieldCheck, BrainCircuit, MessageSquare, Info } from 'lucide-react';

export const AiTransparency: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <a href="/ict/privacy" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    Terug naar Security & Privacy
                </a>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                            <BrainCircuit className="text-purple-600" size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900">AI-Transparantieverklaring</h1>
                            <p className="text-slate-500">Conform EU AI Act (Art. 50)</p>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none">
                        <p className="text-lg leading-relaxed text-slate-600">
                            DGSkills maakt gebruik van kunstmatige intelligentie (AI) om leerlingen interactieve leerervaringen te bieden.
                            Deze verklaring legt uit welke AI we gebruiken, hoe we de privacy borgen en wat de beperkingen zijn.
                        </p>

                        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 my-8">
                            <h2 className="text-indigo-900 font-bold text-lg mb-2 flex items-center gap-2">
                                <Sparkles size={20} /> Onze AI-Belofte aan het Onderwijs
                            </h2>
                            <p className="text-indigo-800 text-sm mb-0">
                                Leerlingdata die wordt ingevoerd in onze AI-functies wordt <strong>nooit</strong> gebruikt om
                                AI-modellen van derden te trainen. Alle dataverwerking vindt plaats binnen beveiligde API-omgevingen in de EU.
                            </p>
                        </div>

                        <h2 className="text-xl font-bold mt-8 mb-4">1. Gebruikte AI-systemen</h2>
                        <p>
                            DGSkills gebruikt de volgende AI-modellen:
                        </p>
                        <ul>
                            <li><strong>Google Gemini (Pro/Flash):</strong> Voor de AI Mentor chat en feedback op missies.</li>
                            <li><strong>Imagen:</strong> Voor het genereren van afbeeldingen in specifieke ontwerp-missies.</li>
                        </ul>

                        <h2 className="text-xl font-bold mt-8 mb-4">2. Transparantie en Herkenbaarheid</h2>
                        <p>
                            In lijn met de EU AI Act (Art. 50) zorgen wij ervoor dat het voor leerlingen altijd duidelijk is wanneer zij met AI communiceren:
                        </p>
                        <ul>
                            <li>AI-antwoorden zijn gemarkeerd met het label <strong>"AI Mentor"</strong> en een sparkles-icoon.</li>
                            <li>Gegenereerde afbeeldingen bevatten een visueel watermerk en UI-disclaimer.</li>
                        </ul>

                        <h2 className="text-xl font-bold mt-8 mb-4">3. Beperkingen en Risico's</h2>
                        <p>
                            AI-modellen kunnen fouten maken (hallucinaties). Wij hanteren de volgende veiligheidsmaatregelen:
                        </p>
                        <ul>
                            <li><strong>Filtering:</strong> Wij maken gebruik van strikte enterprise safety-filters op input en output.</li>
                            <li><strong>Menselijk Toezicht:</strong> De AI geeft nooit formele cijfers. De docent heeft altijd het laatste woord en volledig inzicht in alle AI-interacties via het dashboard.</li>
                            <li><strong>Kwaliteitsbewaking:</strong> Wij loggen AI-interacties voor kwaliteitscontrole, waarbij deze gegevens na 90 dagen worden verwijderd.</li>
                        </ul>

                        <h2 className="text-xl font-bold mt-8 mb-4">4. Privacy-by-Design en Gegevensretentie</h2>
                        <p>
                            Bij het aanroepen van AI-API's sturen wij <strong>geen</strong> direct herleidbare persoonsgegevens zoals namen of e-mailadressen mee.
                        </p>
                        <p>
                            <strong>Belangrijk over retentie:</strong> Hoewel de data niet voor training wordt gebruikt, hanteert Google een standaard retentieperiode van <strong>maximaal 30 dagen</strong> voor tijdelijke opslag van API-inputs ten behoeve van misbruikdetectie en beveiliging. Hierna wordt de data definitief gewist bij de subverwerker.
                        </p>

                        <h2 className="text-xl font-bold mt-8 mb-4">5. High-Risk Classificatie (AI Act Art. 6)</h2>
                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 my-4">
                            <h3 className="text-amber-900 font-bold text-base mb-2 flex items-center gap-2">
                                <ShieldCheck size={18} /> Erkenning: Onderwijs-AI als Hoog Risico
                            </h3>
                            <p className="text-amber-800 text-sm mb-3">
                                De EU AI Act classificeert AI-systemen in het onderwijs als <strong>hoog risico</strong> (Annex III, punt 3)
                                wanneer zij invloed kunnen hebben op het leerproces of de beoordeling van leerlingen.
                            </p>
                            <p className="text-amber-800 text-sm mb-0">
                                DGSkills erkent deze classificatie en voldoet aan de bijbehorende verplichtingen:
                            </p>
                            <ul className="text-amber-800 text-sm mt-2 space-y-1">
                                <li>• <strong>Menselijk toezicht:</strong> De docent heeft altijd het laatste woord via het leerkrachtdashboard.</li>
                                <li>• <strong>Traceerbaarheid:</strong> Alle AI-interacties worden gelogd in een audit trail (Art. 12).</li>
                                <li>• <strong>Risicobeheer:</strong> Content-filtering, safety-filters en output-validatie zijn actief.</li>
                                <li>• <strong>Data governance:</strong> Geen training op leerlingdata, minimale dataverwerking.</li>
                            </ul>
                        </div>

                        <h2 className="text-xl font-bold mt-8 mb-4">6. Verboden Praktijken (AI Act Art. 5)</h2>
                        <p>
                            DGSkills maakt <strong>geen</strong> gebruik van:
                        </p>
                        <ul>
                            <li><strong>Emotieherkenning</strong> — Verboden in onderwijsinstellingen onder de AI Act. Wij analyseren geen emoties, gezichtsuitdrukkingen of sentimenten van leerlingen.</li>
                            <li><strong>Social scoring</strong> — Leerlingen worden niet beoordeeld op basis van hun gedrag buiten het platform.</li>
                            <li><strong>Subliminale beïnvloeding</strong> — De AI geeft geen verborgen sturing of manipulatieve output.</li>
                        </ul>

                        <h2 className="text-xl font-bold mt-8 mb-4">7. Contactpunt AI Act</h2>
                        <p>
                            Conform de AI Act stellen wij een contactpunt beschikbaar voor vragen over ons AI-gebruik:
                        </p>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-4">
                            <p className="text-sm text-slate-700 mb-1"><strong>E-mail:</strong> <a href="mailto:privacy@dgskills.app" className="text-indigo-600 underline">privacy@dgskills.app</a></p>
                            <p className="text-sm text-slate-700 mb-0"><strong>Onderwerp:</strong> AI Act — [Uw vraag]</p>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 mt-12">
                            <Info size={20} className="text-slate-400 shrink-0 mt-1" />
                            <p className="text-xs text-slate-500 mb-0">
                                Deze verklaring is opgesteld om te voldoen aan de transparantieverplichtingen voor AI-systemen in het onderwijs,
                                zoals vastgelegd in de Europese AI Verordening (AI Act), inclusief de hoog-risico vereisten (Art. 6, Annex III)
                                en transparantieverplichtingen (Art. 50). Laatste update: februari 2026.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
