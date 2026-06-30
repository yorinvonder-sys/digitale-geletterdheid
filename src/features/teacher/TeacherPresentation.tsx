import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight, ChevronLeft, X, Play, Maximize2,
    Lightbulb, Target, Users, Sparkles, BrainCircuit,
    ShieldAlert, Database, Pencil, Rocket, Scale,
    Gamepad2, Feather, Cpu, ShieldCheck, AlertCircle, Map, UserCheck
} from 'lucide-react';

// --- TYPES & DATA ---

type SlideType = 'title' | 'context' | 'goals' | 'preview' | 'start' | 'disclaimer';

interface Slide {
    type: SlideType;
    title: string;
    subtitle?: string;
    content?: React.ReactNode; // For flexible layouts
    bgImage?: string; // Optional background image URL
    bgColor?: string; // Fallback or overlay color
}

interface WeekConfig {
    id: string;
    title: string; // e.g. "Week 1: Digital Master"
    theme: string; // color hex
    description: string;
    slides: Slide[];
}

// --- CONTENT GENERATION ---
// "Motivational Speaker, Docent & ICT'er in een!"

const WEEKS_DATA: WeekConfig[] = [
    {
        id: 'week-1',
        title: 'Week 1: Digital Master',
        theme: '#202023', // Blue
        description: 'De basis voor je digitale leven.',
        slides: [
            {
                type: 'title',
                title: 'Week 1: Digital Master 🎓',
                subtitle: 'Word de baas over je eigen iPad en schoolwerk.',
                bgColor: 'from-duck-ink to-duck-acid',
            },
            {
                type: 'context',
                title: 'Waarom doen we dit?',
                subtitle: 'Van chaos naar controle',
                content: (
                    <div className="space-y-6 text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                        <p>
                            Je iPad is je krachtigste tool op school. Maar gebruik jij hem, of gebruikt hij jou?
                            Zonder skills is het gewoon een duur stuk glas.
                        </p>
                        <p className="font-bold text-white text-2xl">
                            Deze week word jij de baas over je eigen iPad.
                        </p>
                        <div className="grid grid-cols-3 gap-6 mt-12">
                            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
                                <div className="text-4xl mb-4">🤯</div>
                                <h3 className="font-bold text-white mb-2">Nooit meer zoeken</h3>
                                <p className="text-sm text-white/90">Je bestanden veilig in de cloud. Nooit meer iets kwijt.</p>
                            </div>
                            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
                                <img
                                    src="/assets/brand/ui-icons/dgskills-duck-default.webp"
                                    alt=""
                                    className="mb-4 h-12 w-12 object-contain"
                                    width={48}
                                    height={48}
                                    loading="lazy"
                                    decoding="async"
                                />
                                <h3 className="font-bold text-white mb-2">Pro Verslagen</h3>
                                <p className="text-sm text-white/90">Word en PowerPoint geheimen voor indrukwekkend werk.</p>
                            </div>
                            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
                                <div className="text-4xl mb-4">🛡️</div>
                                <h3 className="font-bold text-white mb-2">Slim Werken</h3>
                                <p className="text-sm text-white/90">Slaag sneller door Magister en printers slim te gebruiken.</p>
                            </div>
                        </div>
                    </div>
                ),
                bgColor: 'from-duck-ink to-duck-ink',
            },
            {
                type: 'goals',
                title: 'Lesdoelen Week 1',
                subtitle: 'Aan het einde van deze week...',
                content: (
                    <ul className="space-y-6 text-2xl font-light text-left mx-auto max-w-3xl list-none">
                        {[
                            "Kun je inloggen op Magister en je rooster en cijfers vinden.",
                            "Weet je hoe je bestanden opslaat en deelt via OneDrive (Cloud).",
                            "Maak je professionele verslagen in Word met automatische inhoudsopgaven.",
                            "Ontwerp je presentaties die niet saai zijn (PowerPoint).",
                            "Kun je zelfstandig printen vanaf je iPad."
                        ].map((goal, i) => (
                            <motion.li
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.2 + 0.5 }}
                                key={i}
                                className="flex items-start gap-4"
                            >
                                <Target className="min-w-8 text-duck-acid mt-1" />
                                <span>{goal}</span>
                            </motion.li>
                        ))}
                    </ul>
                ),
                bgColor: 'from-duck-ink to-duck-ink',
            },
            {
                type: 'preview',
                title: 'Jouw Missies',
                subtitle: 'Kies je expert-rol en ga aan de slag!',
                content: (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                        {[
                            { title: 'Magister Meester', icon: <ShieldAlert />, color: 'bg-duck-acid', desc: 'Beheers je cijfers' },
                            { title: 'Cloud Commander', icon: <Database />, color: 'bg-duck-acid', desc: 'OneDrive expert' },
                            { title: 'Word Expert', icon: <Pencil />, color: 'bg-duck-acid', desc: 'Schrijf als een pro' },
                            { title: 'Presentatie Expert', icon: <Play />, color: 'bg-duck-acid', desc: 'Presenteer als een baas' },
                        ].map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 * i }}
                                className={`p-6 rounded-2xl ${m.color} backdrop-blur-xl border border-white/20 text-duck-ink flex flex-col items-center text-center shadow-xl transform hover:scale-105 transition-transform`}
                            >
                                <div className="mb-4 p-3 bg-duck-ink/10 rounded-full">{m.icon}</div>
                                <h3 className="font-bold text-lg mb-1">{m.title}</h3>
                                <p className="text-sm opacity-80">{m.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                ),
                bgColor: 'from-duck-ink to-duck-ink',
            },
            {
                type: 'disclaimer',
                title: '⚠️ Let Op!',
                subtitle: 'Sommige functies zijn nog in ontwikkeling',
                content: (
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="bg-duck-acid/20 border-2 border-duck-acid/50 rounded-3xl p-8 backdrop-blur-sm">
                            <p className="text-2xl text-duck-acid font-bold leading-relaxed mb-6">
                                Dit platform is nieuw. Werkt iets nog niet perfect? 
                                Geen probleem — dat hoort bij het leren!
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="bg-white/10 p-6 rounded-2xl text-center border border-white/10">
                                    <div className="text-4xl mb-3">💡</div>
                                    <h4 className="font-bold text-white mb-2">Wees Creatief</h4>
                                    <p className="text-sm text-white/90">Bedenk een alternatieve oplossing.</p>
                                </div>
                                <div className="bg-white/10 p-6 rounded-2xl text-center border border-white/10">
                                    <div className="text-4xl mb-3">🤖</div>
                                    <h4 className="font-bold text-white mb-2">Vraag de Chatbot</h4>
                                    <p className="text-sm text-white/90">De AI geeft je handige tips.</p>
                                </div>
                                <div className="bg-white/10 p-6 rounded-2xl text-center border border-white/10">
                                    <div className="text-4xl mb-3">🙋</div>
                                    <h4 className="font-bold text-white mb-2">Vraag de Docent</h4>
                                    <p className="text-sm text-white/90">Lukt het echt niet? Overleg even.</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-lg text-white/80 text-center italic">
                            "Fouten maken hoort bij leren — ook bij het leren werken met digitale tools!"
                        </p>
                    </div>
                ),
                bgColor: 'from-duck-ink to-duck-ink',
            },
            {
                type: 'start',
                title: 'Klaar om te beginnen?',
                subtitle: 'Start de motoren... 🚀',
                content: (
                    <div className="text-center">
                        <p className="text-2xl mb-8">Log in, kies je eerste missie en word een Digital Master.</p>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-duck-acid text-duck-ink px-12 py-4 rounded-full font-black text-2xl shadow-glow hover:shadow-xl transition-all"
                        >
                            Start de missies
                        </motion.button>
                    </div>
                ),
                bgColor: 'from-duck-ink to-duck-acid',
            }
        ]
    },
    {
        id: 'week-2',
        title: 'Week 2: Creative AI',
        theme: '#e1ff01', // Pink
        description: 'Bouw, Design & Codeer met AI.',
        slides: [
            {
                type: 'title',
                title: 'Week 2: Creative AI 🎨',
                subtitle: 'Van consument naar creator.',
                bgColor: 'from-duck-ink to-duck-ink',
            },
            {
                type: 'context',
                title: 'De Toekomst is NIET saai',
                subtitle: 'AI gaat je baan niet afpakken. Iemand die AI gebruikt wel.',
                content: (
                    <div className="space-y-8 text-xl text-white/80 max-w-5xl mx-auto leading-relaxed">
                        <p className="text-2xl">
                            Vroeger moest je jaren oefenen om iets moois te maken.
                            Nu heb je een superkracht in je broekzak. 🧞‍♂️
                        </p>
                        <p className="font-bold text-white text-3xl">
                            Deze week ga jij dingen maken die eerst onmogelijk leken.
                        </p>

                        {/* Visual Examples Grid */}
                        <div className="grid grid-cols-2 gap-8 mt-12">
                            <div className="group relative overflow-hidden rounded-3xl border-2 border-white/20 shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=600&q=80"
                                    alt="AI Generated Art"
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <div className="text-3xl mb-2">🎮</div>
                                    <h3 className="font-bold text-white text-xl mb-1">Bouw je eigen Game</h3>
                                    <p className="text-sm text-white/90">Creatief ontwerpen zonder gedoe.</p>
                                </div>
                            </div>
                            <div className="group relative overflow-hidden rounded-3xl border-2 border-white/20 shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80"
                                    alt="AI Storytelling"
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <div className="text-3xl mb-2">📖</div>
                                    <h3 className="font-bold text-white text-xl mb-1">Schrijf & Illustreer</h3>
                                    <p className="text-sm text-white/90">Een compleet prentenboek in een uurtje.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ),
                bgColor: 'from-duck-ink to-duck-acid',
            },
            {
                type: 'goals',
                title: 'Lesdoelen Week 2',
                subtitle: 'Wat ga je leren?',
                content: (
                    <ul className="space-y-6 text-2xl font-light text-left mx-auto max-w-3xl list-none">
                        {[
                            "Je leert hoe je AI 'prompts' schrijft om precies te krijgen wat je wilt.",
                            "Je traint zelf een AI-model (Machine Learning) om objecten te herkennen.",
                            "Je bouwt een werkende game met hulp van AI-code.",
                            "Je begrijpt het gevaar van 'Garbage In, Garbage Out'.",
                            "Je maakt je eigen AI-gegenereerde boekcover en verhaal."
                        ].map((goal, i) => (
                            <motion.li
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.2 + 0.5 }}
                                key={i}
                                className="flex items-start gap-4"
                            >
                                <Sparkles className="min-w-8 text-duck-acid mt-1" />
                                <span className="text-white/90">{goal}</span>
                            </motion.li>
                        ))}
                    </ul>
                ),
                bgColor: 'from-duck-ink to-duck-ink',
            },
            {
                type: 'preview',
                title: 'Jouw Missies',
                subtitle: 'Word een creator.',
                content: (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                title: 'Verhalen Ontwerper',
                                icon: <Feather size={32} />,
                                color: 'from-duck-ink to-duck-ink',
                                desc: 'Maak je eigen prentenboek met AI-gegenereerde illustraties',
                                image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'
                            },
                            {
                                title: 'Game Programmeur',
                                icon: <Gamepad2 size={32} />,
                                color: 'from-duck-ink to-duck-ink',
                                desc: 'Bouw Super Jump - een platformer die jij ontwerpt',
                                image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80'
                            },
                            {
                                title: 'AI Trainer',
                                icon: <Cpu size={32} />,
                                color: 'from-duck-ink to-duck-ink',
                                desc: 'Train een neuraal netwerk om objecten te herkennen',
                                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80'
                            },
                        ].map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 * i }}
                                className="group relative overflow-hidden rounded-3xl border border-white/20 text-white shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
                            >
                                <img
                                    src={m.image}
                                    alt={m.title}
                                    className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-br ${m.color} opacity-80`} />
                                <div className="relative z-10 p-8 flex flex-col items-center text-center">
                                    <div className="mb-6 p-4 bg-white/20 rounded-full shadow-inner backdrop-blur-sm">{m.icon}</div>
                                    <h3 className="font-bold text-2xl mb-3">{m.title}</h3>
                                    <p className="text-base opacity-90 leading-relaxed">{m.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ),
                bgColor: 'from-duck-ink to-duck-ink',
            },
            {
                type: 'disclaimer',
                title: '⚠️ Let Op!',
                subtitle: 'Sommige functies zijn nog in ontwikkeling',
                content: (
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="bg-duck-acid/20 border-2 border-duck-acid/50 rounded-3xl p-8 backdrop-blur-sm">
                            <p className="text-2xl text-duck-acid font-bold leading-relaxed mb-6">
                                Dit platform is nieuw. Werkt iets nog niet perfect?
                                Geen probleem — dat hoort bij het leren!
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="bg-white/10 p-6 rounded-2xl text-center border border-white/10">
                                    <div className="text-4xl mb-3">💡</div>
                                    <h4 className="font-bold text-white mb-2">Wees Creatief</h4>
                                    <p className="text-sm text-white/90">Bedenk een alternatieve oplossing.</p>
                                </div>
                                <div className="bg-white/10 p-6 rounded-2xl text-center border border-white/10">
                                    <div className="text-4xl mb-3">🤖</div>
                                    <h4 className="font-bold text-white mb-2">Vraag de Chatbot</h4>
                                    <p className="text-sm text-white/90">De AI geeft je handige tips.</p>
                                </div>
                                <div className="bg-white/10 p-6 rounded-2xl text-center border border-white/10">
                                    <div className="text-4xl mb-3">🙋</div>
                                    <h4 className="font-bold text-white mb-2">Vraag de Docent</h4>
                                    <p className="text-sm text-white/90">Lukt het echt niet? Overleg even.</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-lg text-white/80 text-center italic">
                            "Fouten maken hoort bij leren — ook bij het leren werken met AI!"
                        </p>
                    </div>
                ),
                bgColor: 'from-duck-ink to-duck-ink',
            },
            {
                type: 'start',
                title: 'Imagine Everything.',
                subtitle: 'Jouw fantasie is de enige limiet.',
                content: (
                    <div className="text-center">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-duck-acid text-duck-ink px-12 py-4 rounded-full font-black text-2xl shadow-glow hover:shadow-xl transition-all border-4 border-duck-ink/20"
                        >
                            Aan de slag
                        </motion.button>
                    </div>
                ),
                bgColor: 'from-duck-ink to-duck-ink',
            }
        ]
    },
    {
        id: 'week-3',
        title: 'Week 3: Social & Safety',
        theme: '#202023', // Violet
        description: 'Mediawijsheid en online veiligheid.',
        slides: [
            {
                type: 'title',
                title: 'Week 3: Social & Safety 🛡️',
                subtitle: 'Weet wat je deelt, weet wie je bent.',
                bgColor: 'from-duck-ink to-duck-ink',
            },
            {
                type: 'context',
                title: 'Ben jij het product?',
                subtitle: 'Als het gratis is, betaal je met je data.',
                content: (
                    <div className="space-y-6 text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                        <p>
                            We scrollen, liken en delen elke dag. Maar wie kijkt er mee?
                            Bedrijven bouwen profielen van jou. En screenshots van 'privé' grappen zijn zo gemaakt.
                        </p>
                        <p className="font-bold text-white text-2xl">
                            Deze week leer je hoe je jezelf beschermt in de digitale wereld.
                        </p>
                    </div>
                ),
                bgColor: 'from-duck-ink to-duck-ink',
            },
            {
                type: 'goals',
                title: 'Lesdoelen Week 3',
                subtitle: 'Ethisch hacken van je eigen gedrag',
                content: (
                    <ul className="space-y-6 text-2xl font-light text-left mx-auto max-w-3xl list-none">
                        {[
                            "Je ontdekt hoe algoritmes jouw 'For You' page bepalen (Filterbubbels).",
                            "Je ziet welk 'advertentieprofiel' Big Tech van jou heeft.",
                            "Je leert het STOP-protocol voor online pesten en drama.",
                            "Je leert handelen als een 'omstander' in groepsapps.",
                        ].map((goal, i) => (
                            <motion.li
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.2 + 0.5 }}
                                key={i}
                                className="flex items-start gap-4"
                            >
                                <ShieldCheck className="min-w-8 text-duck-acid mt-1" />
                                <span>{goal}</span>
                            </motion.li>
                        ))}
                    </ul>
                ),
                bgColor: 'from-duck-ink to-duck-ink',
            },
            {
                type: 'preview',
                title: 'Jouw Missies',
                subtitle: 'Bescherm jezelf en anderen.',
                content: (
                    <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {[
                            { title: 'AI Spiegel', icon: <UserCheck />, color: 'bg-duck-acid', desc: 'Zie jezelf zoals adverteerders jou zien' },
                            { title: 'Online Beschermer', icon: <AlertCircle />, color: 'bg-duck-acid', desc: 'Los conflicten in de groepsapp op' },
                        ].map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 * i }}
                                className={`p-8 rounded-3xl ${m.color} backdrop-blur-xl border border-duck-ink/20 text-duck-ink flex flex-col items-center text-center shadow-2xl`}
                            >
                                <div className="mb-6 p-4 bg-white/20 rounded-full shadow-inner">{m.icon}</div>
                                <h3 className="font-bold text-2xl mb-2">{m.title}</h3>
                                <p className="text-base opacity-90">{m.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                ),
                bgColor: 'from-duck-ink to-duck-ink',
            },
            {
                type: 'disclaimer',
                title: '⚠️ Let Op!',
                subtitle: 'Sommige functies zijn nog in ontwikkeling',
                content: (
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="bg-duck-acid/20 border-2 border-duck-acid/50 rounded-3xl p-8 backdrop-blur-sm">
                            <p className="text-2xl text-duck-acid font-bold leading-relaxed mb-6">
                                Dit platform is nieuw. Werkt iets nog niet perfect?
                                Geen probleem — dat hoort bij het leren!
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="bg-white/10 p-6 rounded-2xl text-center border border-white/10">
                                    <div className="text-4xl mb-3">💡</div>
                                    <h4 className="font-bold text-white mb-2">Wees Creatief</h4>
                                    <p className="text-sm text-white/90">Bedenk een alternatieve oplossing.</p>
                                </div>
                                <div className="bg-white/10 p-6 rounded-2xl text-center border border-white/10">
                                    <div className="text-4xl mb-3">🤖</div>
                                    <h4 className="font-bold text-white mb-2">Vraag de Chatbot</h4>
                                    <p className="text-sm text-white/90">De AI geeft je handige tips.</p>
                                </div>
                                <div className="bg-white/10 p-6 rounded-2xl text-center border border-white/10">
                                    <div className="text-4xl mb-3">🙋</div>
                                    <h4 className="font-bold text-white mb-2">Vraag de Docent</h4>
                                    <p className="text-sm text-white/90">Lukt het echt niet? Overleg even.</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-lg text-white/80 text-center italic">
                            "Fouten maken hoort bij leren — ook bij het leren werken met AI!"
                        </p>
                    </div>
                ),
                bgColor: 'from-duck-ink to-duck-ink',
            },
        ]
    },
    {
        id: 'week-4',
        title: 'Week 4: The Project',
        theme: '#e1ff01', // Green
        description: 'Je meesterwerk.',
        slides: [
            {
                type: 'title',
                title: 'Week 4: The Project 🚀',
                subtitle: 'Tijd om alles samen te brengen.',
                bgColor: 'from-duck-ink to-duck-ink',
            },
            {
                type: 'goals',
                title: 'Lesdoelen Week 4',
                subtitle: 'Van idee naar lancering',
                content: (
                    <ul className="space-y-6 text-2xl font-light text-left mx-auto max-w-3xl list-none">
                        {[
                            "Je maakt een waterdichte planning (Blauwdruk).",
                            "Je visualiseert je visie met moodboards en pitches.",
                            "Je ontwerpt promotiemateriaal voor de lancering.",
                            "Je adviseert over ethische dilemma's rondom je uitvinding.",
                        ].map((goal, i) => (
                            <motion.li
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.2 + 0.5 }}
                                key={i}
                                className="flex items-start gap-4"
                            >
                                <Rocket className="min-w-8 text-duck-acid mt-1" />
                                <span>{goal}</span>
                            </motion.li>
                        ))}
                    </ul>
                ),
                bgColor: 'from-duck-ink to-duck-ink',
            },
            {
                type: 'preview',
                title: 'Jouw Missies',
                subtitle: 'Bouw je startup.',
                content: (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                        {[
                            { title: 'De Blauwdruk', icon: <Map />, color: 'bg-duck-ink/5', desc: 'Projectplan' },
                            { title: 'De Visie', icon: <Lightbulb />, color: 'bg-duck-acid', desc: 'Moodboard & Pitch' },
                            { title: 'De Ethische Raad', icon: <Scale />, color: 'bg-duck-acid', desc: 'Slimme Keuzes' },
                            { title: 'De Lancering', icon: <Rocket />, color: 'bg-duck-acid', desc: 'Nu live!' },
                        ].map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                                className={`p-4 rounded-xl ${m.color} backdrop-blur-xl border border-duck-ink/15 text-duck-ink flex flex-col items-center text-center shadow-lg`}
                            >
                                <div className="mb-3 p-2 bg-white/20 rounded-full">{m.icon}</div>
                                <h3 className="font-bold text-base mb-1">{m.title}</h3>
                                <p className="text-xs opacity-80">{m.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                ),
                bgColor: 'from-duck-ink to-duck-ink',
            },
            {
                type: 'disclaimer',
                title: '⚠️ Let Op!',
                subtitle: 'Sommige functies zijn nog in ontwikkeling',
                content: (
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="bg-duck-acid/20 border-2 border-duck-acid/50 rounded-3xl p-8 backdrop-blur-sm">
                            <p className="text-2xl text-duck-acid font-bold leading-relaxed mb-6">
                                Dit platform is nieuw. Werkt iets nog niet perfect?
                                Geen probleem — dat hoort bij het leren!
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="bg-white/10 p-6 rounded-2xl text-center border border-white/10">
                                    <div className="text-4xl mb-3">💡</div>
                                    <h4 className="font-bold text-white mb-2">Wees Creatief</h4>
                                    <p className="text-sm text-white/90">Bedenk een alternatieve oplossing.</p>
                                </div>
                                <div className="bg-white/10 p-6 rounded-2xl text-center border border-white/10">
                                    <div className="text-4xl mb-3">🤖</div>
                                    <h4 className="font-bold text-white mb-2">Vraag de Chatbot</h4>
                                    <p className="text-sm text-white/90">De AI geeft je handige tips.</p>
                                </div>
                                <div className="bg-white/10 p-6 rounded-2xl text-center border border-white/10">
                                    <div className="text-4xl mb-3">🙋</div>
                                    <h4 className="font-bold text-white mb-2">Vraag de Docent</h4>
                                    <p className="text-sm text-white/90">Lukt het echt niet? Overleg even.</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-lg text-white/80 text-center italic">
                            "Fouten maken hoort bij leren — ook bij het leren werken met AI!"
                        </p>
                    </div>
                ),
                bgColor: 'from-duck-ink to-duck-ink',
            },
        ]
    }
];

export const TeacherPresentation = ({ activeWeekId, onClose }: { activeWeekId: string, onClose: () => void }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [selectedWeekId, setSelectedWeekId] = useState<string>(activeWeekId || 'week-1');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showLargeQR, setShowLargeQR] = useState(false);

    const weekConfig = WEEKS_DATA.find(w => w.id === selectedWeekId) || WEEKS_DATA[0];
    const currentSlide = weekConfig.slides[currentSlideIndex];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'Escape') onClose();
            if (e.key === 'f') toggleFullscreen();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlideIndex, onClose]);

    const nextSlide = () => {
        if (currentSlideIndex < weekConfig.slides.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    return (
        <div className={`fixed inset-0 z-50 bg-black text-white overflow-hidden flex flex-col ${isFullscreen ? 'cursor-none' : ''}`}>

            {/* --- CONTROLS HEADER (Auohide in fullscreen maybe?) --- */}
            <div className={`absolute top-0 left-0 w-full p-4 flex justify-between items-center z-50 transition-opacity duration-300 ${isFullscreen && 'opacity-0 hover:opacity-100'}`}>
                <div className="flex gap-2">
                    {WEEKS_DATA.map(week => (
                        <button
                            key={week.id}
                            onClick={() => { setSelectedWeekId(week.id); setCurrentSlideIndex(0); }}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedWeekId === week.id ? 'bg-duck-acid text-duck-ink' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}
                        >
                            {week.title}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <button onClick={toggleFullscreen} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                        <Maximize2 size={24} />
                    </button>
                    <button onClick={onClose} className="p-2 bg-duck-error/80 hover:bg-duck-error text-white rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* --- SLIDE CONTENT --- */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${selectedWeekId}-${currentSlideIndex}`}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "circOut" }}
                    className={`flex-1 flex flex-col items-center justify-center relative p-12 bg-gradient-to-br ${currentSlide.bgColor || 'from-duck-ink to-duck-ink'}`}
                >
                    {/* Background Noise/Texture */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay pointer-events-none"></div>

                    {/* Decorative Elements */}
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="max-w-7xl w-full z-10 flex flex-col items-center text-center">
                        {currentSlide.type === 'title' && (
                            <>
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-8"
                                >
                                    <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 drop-shadow-2xl">
                                        {currentSlide.title}
                                    </h1>
                                </motion.div>
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-3xl md:text-4xl font-light text-white/90"
                                >
                                    {currentSlide.subtitle}
                                </motion.p>
                            </>
                        )}

                        {(currentSlide.type !== 'title') && (
                            <>
                                <motion.h2
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-5xl md:text-6xl font-bold mb-4 tracking-tight"
                                >
                                    {currentSlide.title}
                                </motion.h2>
                                {currentSlide.subtitle && (
                                    <motion.h3
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-2xl text-white/70 mb-12 uppercase tracking-widest font-bold"
                                    >
                                        {currentSlide.subtitle}
                                    </motion.h3>
                                )}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="w-full"
                                >
                                    {currentSlide.content}
                                </motion.div>
                            </>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* --- PROGRESS BAR & NAV --- */}
            <div className="absolute bottom-0 left-0 w-full p-8 flex justify-between items-end z-40 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex gap-2">
                    {weekConfig.slides.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-300 ${i === currentSlideIndex ? 'w-12 bg-white' : 'w-4 bg-white/30'}`}
                        />
                    ))}
                </div>

                {/* QR Code & Website Link */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLargeQR(true)}
                    className="flex items-center gap-4 cursor-pointer hover:bg-white/10 p-2 px-4 rounded-2xl transition-all group border border-transparent hover:border-white/10"
                >
                    <div className="flex flex-col items-end text-right">
                        <span className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1 group-hover:text-white/90 transition-colors">Scan om te beginnen</span>
                        <span className="text-white font-bold text-lg">www.dgskills.app</span>
                    </div>
                    <div className="w-16 h-16 bg-white rounded-xl p-1 shadow-lg group-hover:shadow-white/20 transition-all">
                        <img
                            src="/assets/qr-dgskills.webp"
                            alt="QR Code naar dgskills.app"
                            className="w-full h-full"
                        />
                    </div>
                </motion.div>

                <div className="flex gap-4">
                    <button
                        onClick={prevSlide}
                        disabled={currentSlideIndex === 0}
                        className="p-4 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 backdrop-blur-md transition-all border border-white/5"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        onClick={nextSlide}
                        disabled={currentSlideIndex === weekConfig.slides.length - 1}
                        className="p-4 rounded-full bg-white text-black hover:scale-105 disabled:opacity-30 disabled:scale-100 transition-all shadow-lg"
                    >
                        <ChevronRight size={32} />
                    </button>
                </div>
            </div>
            {/* --- LARGE QR OVERLAY --- */}
            <AnimatePresence>
                {showLargeQR && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowLargeQR(false)}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center cursor-pointer p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white p-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 max-w-lg w-full border-8 border-white/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <span className="inline-block px-4 py-1.5 bg-duck-acid text-duck-ink rounded-full font-black text-xs uppercase tracking-widest mb-4">
                                    Directe Toegang
                                </span>
                                <h2 className="text-duck-ink text-4xl font-black mb-1 tracking-tight">Klaar om te beginnen?</h2>
                                <p className="text-duck-ink/60 font-bold text-lg">Ga naar <span className="text-duck-ink">www.dgskills.app</span></p>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-4 bg-duck-acid/10 rounded-[3rem] blur-2xl group-hover:bg-duck-acid/20 transition-all duration-500" />
                                <div className="relative bg-white p-4 rounded-[2rem] shadow-inner">
                                    <img
                                        src="/assets/qr-dgskills.webp"
                                        alt="Large QR Code"
                                        className="w-full aspect-square max-w-[280px] rounded-2xl"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-4 w-full">
                                <button
                                    onClick={() => setShowLargeQR(false)}
                                    className="w-full py-4 bg-duck-ink text-white rounded-2xl font-black text-lg hover:bg-duck-ink transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl group flex items-center justify-center gap-3"
                                >
                                    <span>Begrepen</span>
                                    <Sparkles className="text-duck-acid group-hover:rotate-12 transition-transform" />
                                </button>
                                <p className="text-duck-ink/60 font-medium text-sm">Klik buiten het venster of op de knop om te sluiten</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
