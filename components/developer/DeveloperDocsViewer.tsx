import React, { useState, useEffect } from 'react';
import { 
    FileText, 
    ExternalLink, 
    Download, 
    Eye, 
    Search,
    ChevronRight,
    FileType,
    CheckCircle2,
    Clock,
    Shield,
    Loader2
} from 'lucide-react';

interface DocItem {
    id: string;
    title: string;
    description: string;
    category: 'strategy' | 'execution' | 'sales' | 'compliance';
    path: string;
    updatedAt: string;
    tags: string[];
    format: 'PDF' | 'HTML' | 'DOCX' | 'MD';
}

export function DeveloperDocsViewer() {
    const [documents, setDocuments] = useState<DocItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<'all' | DocItem['category']>('all');
    const [activeFormat, setActiveFormat] = useState<'all' | 'PDF'>('all');
    const [previewDoc, setPreviewDoc] = useState<DocItem | null>(null);

    useEffect(() => {
        const loadManifest = async () => {
            try {
                const response = await fetch('/dev-docs/manifest.json');
                if (!response.ok) throw new Error('Manifest not found');
                const data = await response.json();
                setDocuments(data);
            } catch (err) {
                console.error('Failed to load document manifest:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadManifest();
    }, []);

    const filteredDocs = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             doc.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
        const matchesFormat = activeFormat === 'all' || doc.format === 'PDF';
        return matchesSearch && matchesCategory && matchesFormat;
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-lab-muted font-medium">Documenten laden...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-6 rounded-3xl border border-lab-muted shadow-sm">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-lab-muted" size={18} />
                        <input 
                            type="text" 
                            placeholder="Zoek in documenten..."
                            className="w-full pl-10 pr-4 py-3 bg-lab-muted border border-lab-muted rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <div className="flex gap-2 p-1 bg-lab-muted rounded-2xl overflow-x-auto">
                        {(['all', 'strategy', 'execution', 'sales', 'compliance'] as const).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                    activeCategory === cat 
                                        ? 'bg-white text-indigo-600 shadow-sm' 
                                        : 'text-lab-muted hover:text-lab-muted'
                                }`}
                            >
                                {cat === 'all' ? 'Alle' : cat === 'strategy' ? 'Strategie' : cat === 'execution' ? 'Uitvoering' : cat === 'sales' ? 'Sales' : 'Compliance'}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2 p-1 bg-lab-muted rounded-2xl">
                        {(['PDF', 'all'] as const).map((fmt) => (
                            <button
                                key={fmt}
                                onClick={() => setActiveFormat(fmt)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                    activeFormat === fmt 
                                        ? 'bg-indigo-600 text-white shadow-sm' 
                                        : 'text-lab-muted hover:text-lab-muted'
                                }`}
                            >
                                {fmt === 'PDF' ? 'Alleen PDF' : 'Alle Types'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Docs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocs.map((doc) => (
                    <div 
                        key={doc.id}
                        className="group bg-white rounded-3xl border border-lab-muted shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all duration-300 overflow-hidden flex flex-col"
                    >
                        {/* Thumbnail / Header Area */}
                        <div className={`h-40 relative flex items-center justify-center ${
                            doc.category === 'strategy' ? 'bg-indigo-50' :
                            doc.category === 'execution' ? 'bg-lab-sage' :
                            doc.category === 'compliance' ? 'bg-purple-50' :
                            'bg-lab-gold'
                        }`}>
                            <div className={`p-6 rounded-2xl shadow-sm ${
                                doc.category === 'strategy' ? 'bg-white text-indigo-600' :
                                doc.category === 'execution' ? 'bg-white text-lab-sage' :
                                doc.category === 'compliance' ? 'bg-white text-purple-600' :
                                'bg-white text-lab-gold'
                            }`}>
                                <FileText size={48} strokeWidth={1.5} />
                            </div>
                            
                            <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest border border-lab-muted shadow-sm ${
                                    doc.format === 'PDF' ? 'text-red-600' : 'text-blue-600'
                                }`}>
                                    {doc.format}
                                </span>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex gap-2 mb-3">
                                {doc.tags.map(tag => (
                                    <span key={tag} className="text-[9px] font-bold text-lab-muted border border-lab-muted px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            
                            <h4 className="text-xl font-black text-lab-muted mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                {doc.title}
                            </h4>
                            <p className="text-lab-muted text-sm leading-relaxed mb-6 flex-1">
                                {doc.description}
                            </p>

                            <div className="flex items-center justify-between pt-6 border-t border-lab-muted">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-lab-muted">
                                    <Clock size={12} />
                                    {new Date(doc.updatedAt).toLocaleDateString('nl-NL')}
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => window.open(doc.path, '_blank')}
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                                        title="Open in nieuw venster"
                                    >
                                        <ExternalLink size={20} />
                                    </button>
                                    <a 
                                        href={doc.path} 
                                        download 
                                        className="p-2 text-lab-muted hover:bg-lab-muted rounded-xl transition-colors"
                                        title="Downloaden"
                                    >
                                        <Download size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Security/GDPR Note */}
            <div className="bg-lab-muted rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-lab-sage/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                    <Shield size={32} className="text-lab-sage" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Veiligheids- & Compliance Richtlijnen</h3>
                    <p className="text-lab-muted text-sm leading-relaxed max-w-2xl">
                        Deze documenten bevatten vertrouwelijke strategieën van DGSkills. Deel deze alleen met geautoriseerde partners en scholen onder een NDA of pilot-overeenkomst. Alle documenten zijn APA-onderbouwd en SLO-gevalideerd voor 2025.
                    </p>
                </div>
                <div className="md:ml-auto">
                    <div className="flex items-center gap-2 px-4 py-2 bg-lab-sage/10 border border-lab-sage/20 rounded-full">
                        <CheckCircle2 size={16} className="text-lab-sage" />
                        <span className="text-[10px] font-black text-lab-sage uppercase tracking-widest">Geverifieerd 2025</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
