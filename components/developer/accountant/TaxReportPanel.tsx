import React, { useState, useEffect } from 'react';
import {
    FileText, Download, CheckCircle, AlertCircle, Settings, Save,
    Copy, Check, ExternalLink,
} from 'lucide-react';
import {
    YearSummary,
    TaxCalculation,
    AccountantSettings,
    saveSettings,
    formatEuro,
} from '../../../services/accountantService';

interface TaxReportPanelProps {
    summary: YearSummary;
    tax: TaxCalculation;
    settings: AccountantSettings | null;
    userId: string;
    onSettingsChange: (s: AccountantSettings) => void;
}

export function TaxReportPanel({ summary, tax, settings, userId, onSettingsChange }: TaxReportPanelProps) {
    const [showSettings, setShowSettings] = useState(false);
    const [savingSettings, setSavingSettings] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [localSettings, setLocalSettings] = useState({
        business_name:  settings?.business_name  || '',
        kvk_number:     settings?.kvk_number     || '',
        starter_aftrek: settings?.starter_aftrek || false,
        tax_year:       settings?.tax_year        || 2025,
    });

    // Sync localSettings als de settings-prop van buiten verandert (bijv. na eerste load)
    useEffect(() => {
        setLocalSettings({
            business_name:  settings?.business_name  || '',
            kvk_number:     settings?.kvk_number     || '',
            starter_aftrek: settings?.starter_aftrek || false,
            tax_year:       settings?.tax_year        || 2025,
        });
        // Toon formulier direct als bedrijfsnaam nog leeg is
        setShowSettings(!settings?.business_name);
    }, [settings]);

    async function handleSaveSettings() {
        setSavingSettings(true);
        setSaveError('');
        try {
            const saved = await saveSettings({
                user_id:       userId,
                business_name: localSettings.business_name || undefined,
                kvk_number:    localSettings.kvk_number    || undefined,
                starter_aftrek: localSettings.starter_aftrek,
                tax_year:      localSettings.tax_year,
            });
            onSettingsChange(saved);
            setShowSettings(false);
        } catch (e: any) {
            setSaveError(e.message || 'Opslaan mislukt.');
        } finally {
            setSavingSettings(false);
        }
    }

    function exportPDF() {
        // Dynamisch importeren zodat de bundle niet altijd jsPDF laadt
        import('jspdf').then(({ jsPDF }) => {
            const doc = new jsPDF();
            const year = summary.year;
            const name = settings?.business_name || 'ZZP-er';
            const kvk  = settings?.kvk_number ? `KvK: ${settings.kvk_number}` : '';

            const euro = (v: number) => `€ ${v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
            const line = (label: string, value: number | string, bold = false, offset = 0) => {
                if (bold) doc.setFont('helvetica', 'bold');
                else doc.setFont('helvetica', 'normal');
                doc.text(label, 20 + offset, y);
                if (typeof value === 'number') {
                    doc.text(euro(value), 160, y, { align: 'right' });
                } else {
                    doc.text(value, 160, y, { align: 'right' });
                }
                y += 8;
            };

            let y = 20;

            // Header
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text(`Belastingoverzicht ${year}`, 20, y);
            y += 8;

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(name, 20, y);
            if (kvk) { y += 5; doc.text(kvk, 20, y); }
            y += 5;
            doc.text(`Gegenereerd op: ${new Date().toLocaleDateString('nl-NL')}`, 20, y);
            y += 12;

            // Scheidingslijn
            doc.setDrawColor(200, 200, 200);
            doc.line(20, y, 190, y);
            y += 8;

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Winst- en verliesrekening', 20, y);
            y += 8;

            doc.setFontSize(10);
            line('Bruto-omzet', summary.totalIncome);
            line('Zakelijke kosten', -summary.totalExpenses);
            doc.line(20, y, 190, y);
            y += 4;
            line('Winst uit onderneming', summary.profit, true);
            y += 6;

            // Aftrekposten
            doc.setFont('helvetica', 'bold');
            doc.text('Aftrekposten (ZZP)', 20, y);
            y += 8;
            doc.setFont('helvetica', 'normal');
            line('Zelfstandigenaftrek', -tax.zelfstandigenaftrek);
            if (tax.startersaftrek > 0) line('Startersaftrek', -tax.startersaftrek);
            line('MKB-winstvrijstelling (13,31%)', -tax.mkbWinstvrijstelling);
            doc.line(20, y, 190, y);
            y += 4;
            line('Belastbaar inkomen Box 1', tax.taxableIncome, true);
            y += 6;

            // Belasting
            doc.setFont('helvetica', 'bold');
            doc.text('Inkomstenbelasting 2025', 20, y);
            y += 8;
            doc.setFont('helvetica', 'normal');

            const in1 = Math.min(tax.taxableIncome, 76814);
            const in2 = Math.max(0, tax.taxableIncome - 76814);
            line(`Schijf 1 (t/m € 76.814 × 36,97%)`, in1 * 0.3697);
            if (in2 > 0) line(`Schijf 2 (boven € 76.814 × 49,50%)`, in2 * 0.495);
            doc.line(20, y, 190, y);
            y += 4;
            line('Geschatte inkomstenbelasting', tax.estimatedTax, true);
            doc.text(`Effectief tarief: ${tax.effectiveRate.toFixed(1)}%`, 20, y);
            y += 10;

            // BTW
            doc.setFont('helvetica', 'bold');
            doc.text('BTW-opgave', 20, y);
            y += 8;
            doc.setFont('helvetica', 'normal');
            line('BTW ontvangen (omzet)', summary.vatCollected);
            line('BTW betaald (inkoop)', -summary.vatPaid);
            doc.line(20, y, 190, y);
            y += 4;
            line(summary.vatBalance >= 0 ? 'BTW af te dragen' : 'BTW te vorderen', Math.abs(summary.vatBalance), true);
            y += 10;

            // Disclaimer
            doc.setFontSize(8);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(150, 150, 150);
            doc.text(
                'Dit overzicht is indicatief. Raadpleeg een belastingadviseur voor definitieve aangifte.',
                20, y
            );

            doc.save(`belastingoverzicht_${year}.pdf`);
        });
    }

    // Checklist items voor aangifte
    const checklistItems = [
        { label: 'Bedrijfsnaam ingevuld', done: !!settings?.business_name },
        { label: 'KvK-nummer ingevuld',   done: !!settings?.kvk_number },
        { label: 'Omzet geboekt',          done: summary.totalIncome > 0 },
        { label: 'Kosten gecategoriseerd', done: summary.totalExpenses > 0 },
        { label: 'Bonnetjes opgeslagen',   done: true },
    ];
    const allDone = checklistItems.every(i => i.done);

    return (
        <div className="space-y-8">
            {/* Instellingen */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                            <Settings size={20} className="text-slate-600" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Bedrijfsgegevens</h3>
                    </div>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest"
                    >
                        {showSettings ? 'Sluiten' : 'Bewerken'}
                    </button>
                </div>

                {showSettings ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bedrijfsnaam</label>
                                <input
                                    type="text"
                                    value={localSettings.business_name}
                                    onChange={e => setLocalSettings(s => ({ ...s, business_name: e.target.value }))}
                                    placeholder="Jouw Bedrijf"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">KvK-nummer</label>
                                <input
                                    type="text"
                                    value={localSettings.kvk_number}
                                    onChange={e => setLocalSettings(s => ({ ...s, kvk_number: e.target.value }))}
                                    placeholder="12345678"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="starter"
                                checked={localSettings.starter_aftrek}
                                onChange={e => setLocalSettings(s => ({ ...s, starter_aftrek: e.target.checked }))}
                                className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <label htmlFor="starter" className="text-sm font-medium text-slate-700">
                                Startersaftrek (eerste 3 jaar als ZZP-er) — extra €2.123 aftrek
                            </label>
                        </div>
                        <button
                            onClick={handleSaveSettings}
                            disabled={savingSettings}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            <Save size={16} />
                            {savingSettings ? 'Opslaan...' : 'Opslaan'}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Bedrijfsnaam</p>
                            <p className="font-bold text-slate-800">{settings?.business_name || '—'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">KvK-nummer</p>
                            <p className="font-bold text-slate-800">{settings?.kvk_number || '—'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Startersaftrek</p>
                            <p className="font-bold text-slate-800">{settings?.starter_aftrek ? 'Ja' : 'Nee'}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* IB-aangifte overzicht */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Berekening */}
                <div className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-1">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">
                        IB Berekening {summary.year} — ZZP Box 1
                    </h3>

                    <Row label="Bruto-omzet"         value={tax.grossIncome}         color="text-emerald-400" />
                    <Row label="Zakelijke kosten"     value={-tax.totalExpenses}       color="text-red-400" />
                    <Divider />
                    <Row label="Winst onderneming"    value={tax.profit}               bold color="text-white" />

                    <div className="h-3" />
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Aftrekposten</p>

                    <Row label="Zelfstandigenaftrek"   value={-tax.zelfstandigenaftrek}  color="text-blue-300" />
                    {tax.startersaftrek > 0 && (
                        <Row label="Startersaftrek"    value={-tax.startersaftrek}        color="text-blue-300" />
                    )}
                    <Row label="MKB-winstvrijstelling" value={-tax.mkbWinstvrijstelling}  color="text-blue-300" />
                    <Divider />
                    <Row label="Belastbaar inkomen"    value={tax.taxableIncome}          bold color="text-white" />

                    <div className="h-3" />
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Inkomstenbelasting</p>

                    <Row label="Schijf 1 (t/m €76.814 × 36,97%)"
                        value={Math.min(tax.taxableIncome, 76814) * 0.3697} color="text-slate-300" />
                    {tax.taxableIncome > 76814 && (
                        <Row label="Schijf 2 (boven €76.814 × 49,50%)"
                            value={(tax.taxableIncome - 76814) * 0.495} color="text-slate-300" />
                    )}
                    <Divider />
                    <Row label="Geschatte belasting" value={tax.estimatedTax} bold color="text-amber-400" />

                    <p className="text-[10px] text-slate-600 pt-2">
                        Effectief tarief: {tax.effectiveRate.toFixed(1)}%
                    </p>
                </div>

                {/* Checklist + Export */}
                <div className="space-y-4">
                    {/* Aangifte checklist */}
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">
                            Aangifte Checklist
                        </h3>
                        <div className="space-y-3">
                            {checklistItems.map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    {item.done ? (
                                        <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                                    ) : (
                                        <AlertCircle size={18} className="text-amber-400 shrink-0" />
                                    )}
                                    <span className={`text-sm font-medium ${item.done ? 'text-slate-700' : 'text-amber-600'}`}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {!allDone && (
                            <p className="text-xs text-amber-600 bg-amber-50 rounded-xl px-4 py-3 mt-4 font-medium">
                                Vul alle ontbrekende gegevens in voor een compleet overzicht.
                            </p>
                        )}
                    </div>

                    {/* Export */}
                    <div className="bg-indigo-50 rounded-[2rem] border border-indigo-100 p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <FileText size={20} className="text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="font-black text-indigo-900 uppercase tracking-tight">PDF Exporteren</h3>
                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Belastingoverzicht {summary.year}</p>
                            </div>
                        </div>
                        <p className="text-xs text-indigo-700 mb-5 leading-relaxed">
                            Genereer een volledig belastingoverzicht inclusief winst- en verliesrekening, BTW-saldo en IB-berekening.
                        </p>
                        <button
                            onClick={exportPDF}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            <Download size={16} />
                            Download PDF
                        </button>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4">
                        <p className="text-xs text-slate-500 leading-relaxed">
                            <strong className="text-slate-700">Let op:</strong> Dit overzicht is indicatief en dient als voorbereiding op je aangifte.
                            De definitieve aangifte doe je via <strong className="text-slate-700">Mijn Belastingdienst</strong>.
                            Raadpleeg bij twijfel een belastingadviseur.
                        </p>
                    </div>
                </div>
            </div>
            {/* Belastingdienst Invulhulp */}
            <BelastingdienstInvulhulp tax={tax} summary={summary} />
        </div>
    );
}

// ============================================================================
// Belastingdienst Invulhulp — exacte IB-aangifte velden met kopieerknop
// ============================================================================

function CopyField({ label, rugnummer, value, hint }: {
    label: string;
    rugnummer?: string;
    value: string;
    hint?: string;
}) {
    const [copied, setCopied] = useState(false);

    function handleCopy() {
        navigator.clipboard.writeText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    return (
        <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-200 transition-colors group">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    {rugnummer && (
                        <span className="text-[9px] font-black bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded uppercase tracking-widest shrink-0">
                            {rugnummer}
                        </span>
                    )}
                    <span className="text-xs text-slate-500 font-medium truncate">{label}</span>
                </div>
                <p className="text-sm font-black text-slate-900 mt-0.5 tabular-nums">{value}</p>
                {hint && <p className="text-[10px] text-slate-400 mt-0.5">{hint}</p>}
            </div>
            <button
                onClick={handleCopy}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 group-hover:bg-indigo-50 transition-colors"
                title="Kopiëren"
            >
                {copied
                    ? <Check size={14} className="text-emerald-500" />
                    : <Copy size={14} className="text-slate-400 group-hover:text-indigo-500" />
                }
            </button>
        </div>
    );
}

function BelastingdienstInvulhulp({ tax, summary }: { tax: TaxCalculation; summary: YearSummary }) {
    const fmt = (v: number) => new Intl.NumberFormat('nl-NL', {
        minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(Math.round(v));

    const euro = (v: number) => new Intl.NumberFormat('nl-NL', {
        style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
    }).format(Math.round(Math.abs(v)));

    return (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <FileText size={20} className="text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Invulhulp Belastingdienst</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Kopieer waarden direct naar Mijn Belastingdienst</p>
                    </div>
                </div>
                <a
                    href="https://mijn.belastingdienst.nl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                    <ExternalLink size={13} />
                    Naar Belastingdienst
                </a>
            </div>

            <div className="space-y-6">
                {/* Stap 1: Inkomsten */}
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        Stap 1 — Winst uit onderneming (Box 1)
                    </p>
                    <div className="space-y-2">
                        <CopyField
                            rugnummer="1a"
                            label="Omzet / opbrengst uit onderneming"
                            value={fmt(tax.grossIncome)}
                            hint="Totale omzet exclusief BTW"
                        />
                        <CopyField
                            rugnummer="1b"
                            label="Zakelijke kosten"
                            value={fmt(tax.totalExpenses)}
                            hint="Alle aftrekbare bedrijfskosten"
                        />
                        <CopyField
                            rugnummer="1c"
                            label="Winst uit onderneming"
                            value={fmt(tax.profit)}
                            hint="Omzet minus kosten"
                        />
                    </div>
                </div>

                {/* Stap 2: Ondernemersaftrek */}
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        Stap 2 — Ondernemersaftrek
                    </p>
                    <div className="space-y-2">
                        <CopyField
                            rugnummer="2a"
                            label="Zelfstandigenaftrek"
                            value={fmt(tax.zelfstandigenaftrek)}
                            hint="Maximaal €5.030 voor belastingjaar 2025"
                        />
                        {tax.startersaftrek > 0 && (
                            <CopyField
                                rugnummer="2b"
                                label="Startersaftrek"
                                value={fmt(tax.startersaftrek)}
                                hint="Extra €2.123 voor de eerste 3 jaar als ZZP-er"
                            />
                        )}
                        <CopyField
                            rugnummer="2c"
                            label="MKB-winstvrijstelling (13,31%)"
                            value={fmt(tax.mkbWinstvrijstelling)}
                            hint="Automatisch berekend na ondernemersaftrek"
                        />
                    </div>
                </div>

                {/* Stap 3: Belastbaar inkomen */}
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        Stap 3 — Belastbaar inkomen
                    </p>
                    <div className="space-y-2">
                        <CopyField
                            rugnummer="3a"
                            label="Belastbaar inkomen Box 1"
                            value={fmt(tax.taxableIncome)}
                            hint="Winst minus alle aftrekposten"
                        />
                        <CopyField
                            rugnummer="3b"
                            label="Geschatte inkomstenbelasting"
                            value={euro(tax.estimatedTax)}
                            hint={`Effectief tarief: ${tax.effectiveRate.toFixed(1)}%`}
                        />
                    </div>
                </div>

                {/* BTW */}
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        BTW-aangifte (kwartaal / jaar)
                    </p>
                    <div className="space-y-2">
                        <CopyField
                            label="BTW ontvangen (rubriek 1a)"
                            value={fmt(summary.vatCollected)}
                            hint="Invullen bij BTW-aangifte veld 1a"
                        />
                        <CopyField
                            label="Voorbelasting (rubriek 5b)"
                            value={fmt(summary.vatPaid)}
                            hint="BTW betaald op inkopen — veld 5b"
                        />
                        <CopyField
                            label={summary.vatBalance >= 0 ? 'Te betalen BTW (rubriek 5g)' : 'Terug te vragen BTW (rubriek 5g)'}
                            value={euro(summary.vatBalance)}
                            hint={summary.vatBalance >= 0 ? 'Afdragen aan Belastingdienst' : 'Terugvragen van Belastingdienst'}
                        />
                    </div>
                </div>

                {/* Stappenplan */}
                <div className="bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100">
                    <p className="text-xs font-black text-slate-700 uppercase tracking-widest">Stappenplan aangifte</p>
                    {[
                        'Ga naar mijn.belastingdienst.nl en log in met DigiD',
                        'Kies "Inkomstenbelasting" → "Aangifte ' + summary.year + '"',
                        'Vul bij "Winst uit onderneming" de waarden van stap 1 in',
                        'Bij "Aftrekposten": voer zelfstandigenaftrek en startersaftrek in',
                        'Controleer het belastbaar inkomen (stap 3) — dit berekent de Belastingdienst zelf',
                        'BTW doe je apart via "Omzetbelasting" → "Kwartaalaangifte"',
                    ].map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center mt-0.5">
                                {i + 1}
                            </span>
                            <p className="text-xs text-slate-600 leading-relaxed">{step}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Row({ label, value, bold = false, color = 'text-slate-300' }: {
    label: string; value: number; bold?: boolean; color?: string
}) {
    const formatted = new Intl.NumberFormat('nl-NL', {
        style: 'currency', currency: 'EUR'
    }).format(value);

    return (
        <div className="flex justify-between items-center py-0.5">
            <span className={`text-xs ${bold ? 'font-black text-white' : 'text-slate-400'}`}>{label}</span>
            <span className={`text-xs font-bold tabular-nums ${bold ? 'font-black ' + color : color}`}>{formatted}</span>
        </div>
    );
}

function Divider() {
    return <div className="border-t border-white/10 my-2" />;
}
