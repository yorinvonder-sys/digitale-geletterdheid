/**
 * DPA PDF Generator — Developer Dashboard tab
 *
 * Formulier waarmee een developer de gegevens van een school invult
 * en vervolgens een complete, ondertekenbare Verwerkersovereenkomst (DPA)
 * als PDF downloadt. DGSkills-gegevens en subverwerkers zijn vooringevuld.
 *
 * GEEN database-writes, GEEN opslag — puur client-side PDF-generatie.
 */

import React, { useState } from 'react';
import { generateDpaPdf, type DpaFormData } from '@/services/dpaPdfService';
import { extractDpaSchoolData } from '@/services/dpaAiService';

// ============================================================================
// Statische DGSkills-info (spiegelt DGSKILLS_ENTITY in dpaPdfService)
// ============================================================================

const DGSKILLS_INFO = [
    ['Handelsnaam', 'DGSkills.app'],
    ['Rechtsvorm', 'Eenmanszaak'],
    ['KvK-nummer', '81819889'],
    ['Vestigingsnummer', '000048087815'],
    ['Adres', 'Oldruitenborghstraat 39, 8043 TP Zwolle'],
    ['E-mail', 'info@dgskills.app'],
] as const;

const SUBVERWERKERS_INFO = [
    { naam: 'Supabase', dienst: 'Database / Auth / Hosting backend', locatie: 'EU-projectregio / EER, contractueel en projectmatig te verifieren' },
    { naam: 'Mistral AI', dienst: 'Tekst / Vision / OCR', locatie: 'api.mistral.ai (EU, Frankrijk)' },
    { naam: 'Black Forest Labs', dienst: 'Beeldgeneratie FLUX', locatie: 'api.eu.bfl.ai (EU-endpoint)' },
    { naam: 'Vercel', dienst: 'Frontend hosting / CDN', locatie: 'EU-edge ams1' },
] as const;

// ============================================================================
// Validatie
// ============================================================================

interface FormErrors {
    schoolNaam?: string;
    bezoekadres?: string;
    postcodePlaats?: string;
    vertegenwoordigerNaam?: string;
    vertegenwoordigerFunctie?: string;
    vertegenwoordigerEmail?: string;
    ondertekeningPlaats?: string;
    ondertekeningDatum?: string;
    verwerkerVertegenwoordiger?: string;
}

function validate(data: DpaFormData): FormErrors {
    const errors: FormErrors = {};
    if (!data.schoolNaam.trim()) errors.schoolNaam = 'Schoolnaam is verplicht.';
    if (!data.bezoekadres.trim()) errors.bezoekadres = 'Bezoekadres is verplicht.';
    if (!data.postcodePlaats.trim()) errors.postcodePlaats = 'Postcode en plaats zijn verplicht.';
    if (!data.vertegenwoordigerNaam.trim()) errors.vertegenwoordigerNaam = 'Naam vertegenwoordiger is verplicht.';
    if (!data.vertegenwoordigerFunctie.trim()) errors.vertegenwoordigerFunctie = 'Functie is verplicht.';
    if (!data.vertegenwoordigerEmail.trim()) errors.vertegenwoordigerEmail = 'E-mailadres is verplicht.';
    if (!data.ondertekeningPlaats.trim()) errors.ondertekeningPlaats = 'Ondertekeningsplaats is verplicht.';
    if (!data.ondertekeningDatum.trim()) errors.ondertekeningDatum = 'Datum is verplicht.';
    if (!data.verwerkerVertegenwoordiger.trim()) errors.verwerkerVertegenwoordiger = 'DGSkills-ondertekenaar is verplicht.';
    return errors;
}

// ============================================================================
// Herbruikbaar invoerveld
// ============================================================================

function Field({
    label,
    value,
    onChange,
    error,
    placeholder,
    type = 'text',
    required = true,
    readOnly = false,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
    readOnly?: boolean;
}) {
    return (
        <div>
            <label className="block text-xs font-bold text-duck-ink uppercase tracking-widest mb-1">
                {label}
                {required && <span className="text-duck-error ml-0.5">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                readOnly={readOnly}
                className={[
                    'w-full rounded-xl border px-4 py-2.5 text-sm text-duck-ink bg-white',
                    'focus:outline-none focus:ring-2 focus:ring-duck-acid focus:border-duck-acid',
                    'transition-colors',
                    error ? 'border-duck-error' : 'border-duck-ink/15',
                    readOnly ? 'bg-duck-bgLight text-duck-ink/60 cursor-not-allowed' : '',
                ].join(' ')}
            />
            {error && (
                <p className="mt-1 text-xs text-duck-error font-medium">{error}</p>
            )}
        </div>
    );
}

// ============================================================================
// Hoofdcomponent
// ============================================================================

export const DpaPdfGenerator: React.FC = () => {
    const today = new Date().toISOString().slice(0, 10);

    const [form, setForm] = useState<DpaFormData>({
        schoolNaam: '',
        bezoekadres: '',
        postcodePlaats: '',
        kvkNummer: '',
        vertegenwoordigerNaam: '',
        vertegenwoordigerFunctie: '',
        vertegenwoordigerEmail: '',
        ondertekeningPlaats: '',
        ondertekeningDatum: today,
        verwerkerVertegenwoordiger: 'Yorin Vonder',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [generating, setGenerating] = useState(false);
    const [success, setSuccess] = useState(false);

    // Snel-invullen met Mistral
    const [pasteText, setPasteText] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [aiFilled, setAiFilled] = useState(false);

    function set(field: keyof DpaFormData) {
        return (value: string) => {
            setForm(prev => ({ ...prev, [field]: value }));
            if (errors[field as keyof FormErrors]) {
                setErrors(prev => ({ ...prev, [field]: undefined }));
            }
            setSuccess(false);
        };
    }

    async function handleCreateWithMistral() {
        if (!pasteText.trim() || aiLoading) return;
        setAiLoading(true);
        setAiError('');
        setAiFilled(false);
        try {
            const data = await extractDpaSchoolData(pasteText);
            // Merge alleen niet-lege velden; bestaande invoer niet wissen.
            const filled = Object.fromEntries(
                Object.entries(data).filter(([, v]) => typeof v === 'string' && v.trim() !== ''),
            ) as Partial<DpaFormData>;
            setForm(prev => ({ ...prev, ...filled }));
            // Wis validatiefouten van de zojuist gevulde velden.
            setErrors(prev => {
                const next = { ...prev };
                (Object.keys(filled) as (keyof FormErrors)[]).forEach(k => { delete next[k]; });
                return next;
            });
            setSuccess(false);
            setAiFilled(true);
        } catch (err) {
            setAiError(err instanceof Error ? err.message : 'Invullen mislukt. Probeer het opnieuw of vul handmatig in.');
        } finally {
            setAiLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSuccess(false);

        const errs = validate(form);
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        setGenerating(true);
        try {
            await generateDpaPdf(form);
            setSuccess(true);
        } catch (err) {
            console.error('DPA PDF generatie mislukt:', err);
        } finally {
            setGenerating(false);
        }
    }

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Disclaimer */}
            <div className="rounded-2xl border border-duck-ink/15 bg-white p-6">
                <p className="text-sm text-duck-ink/70 leading-relaxed">
                    <span className="font-bold text-duck-ink">DPA Generator (concept)</span> — Dit hulpmiddel
                    genereert een concept-Verwerkersovereenkomst op basis van het Model Verwerkersovereenkomst 4.0.
                    De juridische artikeltekst wordt ongewijzigd overgenomen uit het interne template.{' '}
                    <span className="font-bold text-duck-ink">Laat elk gegenereerd document vóór ondertekening
                    controleren door een jurist of Functionaris voor de Gegevensbescherming (FG).</span>
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Formulier */}
                <form onSubmit={handleSubmit} noValidate className="lg:col-span-2 space-y-6">

                    {/* Snel invullen met Mistral (AI-extractie uit geplakte tekst) */}
                    <section className="bg-white rounded-2xl border-2 border-duck-acid p-6 space-y-4">
                        <div>
                            <h3 className="text-sm font-black text-duck-ink uppercase tracking-widest">
                                Snel invullen met Mistral
                                <span className="ml-2 text-[10px] font-bold text-duck-ink/40 normal-case tracking-normal">optioneel</span>
                            </h3>
                            <p className="mt-1 text-xs text-duck-ink/60 leading-relaxed">
                                Plak de schoolgegevens (uit een mail of van de schoolsite). De slimste Mistral-AI
                                vult de velden hieronder in. De AI verzint niets — wat niet in je tekst staat, blijft leeg.
                                Controleer daarna elk veld.
                            </p>
                        </div>

                        <textarea
                            value={pasteText}
                            onChange={e => { setPasteText(e.target.value); setAiError(''); }}
                            rows={5}
                            placeholder="Plak hier de schoolgegevens, bijv. naam, bezoekadres, postcode en plaats, KvK-nummer, contactpersoon + functie + e-mail…"
                            className="w-full rounded-xl border border-duck-ink/15 px-4 py-2.5 text-sm text-duck-ink bg-white focus:outline-none focus:ring-2 focus:ring-duck-acid focus:border-duck-acid transition-colors resize-y"
                        />

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={handleCreateWithMistral}
                                disabled={aiLoading || !pasteText.trim()}
                                className={[
                                    'flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm',
                                    'uppercase tracking-widest transition-all duration-200 border border-duck-ink',
                                    aiLoading || !pasteText.trim()
                                        ? 'bg-duck-acid/40 text-duck-ink/50 cursor-not-allowed'
                                        : 'bg-duck-acid text-duck-ink hover:-translate-y-0.5 shadow-sm',
                                ].join(' ')}
                            >
                                {aiLoading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-duck-ink/30 border-t-duck-ink rounded-full animate-spin" />
                                        Invullen…
                                    </>
                                ) : (
                                    'Create with Mistral'
                                )}
                            </button>

                            {aiFilled && !aiError && (
                                <p className="text-xs font-medium text-duck-ink/70">
                                    Velden ingevuld — controleer elk veld vóór je de PDF maakt.
                                </p>
                            )}
                        </div>

                        {aiError && (
                            <p className="text-xs text-duck-error font-medium">{aiError}</p>
                        )}
                    </section>

                    {/* Schoolgegevens */}
                    <section className="bg-white rounded-2xl border border-duck-ink/15 p-6 space-y-4">
                        <h3 className="text-sm font-black text-duck-ink uppercase tracking-widest">
                            Schoolgegevens (Verwerkingsverantwoordelijke)
                        </h3>
                        <Field
                            label="Naam van de school"
                            value={form.schoolNaam}
                            onChange={set('schoolNaam')}
                            error={errors.schoolNaam}
                            placeholder="bijv. RSG De Bornego"
                        />
                        <Field
                            label="Bezoekadres"
                            value={form.bezoekadres}
                            onChange={set('bezoekadres')}
                            error={errors.bezoekadres}
                            placeholder="bijv. Buitenpost 1"
                        />
                        <Field
                            label="Postcode en plaats"
                            value={form.postcodePlaats}
                            onChange={set('postcodePlaats')}
                            error={errors.postcodePlaats}
                            placeholder="bijv. 8401 DK Gorredijk"
                        />
                        <Field
                            label="KvK-nummer"
                            value={form.kvkNummer ?? ''}
                            onChange={set('kvkNummer')}
                            error={undefined}
                            placeholder="optioneel"
                            required={false}
                        />
                    </section>

                    {/* Vertegenwoordiger school */}
                    <section className="bg-white rounded-2xl border border-duck-ink/15 p-6 space-y-4">
                        <h3 className="text-sm font-black text-duck-ink uppercase tracking-widest">
                            Vertegenwoordiger van de school
                        </h3>
                        <Field
                            label="Naam"
                            value={form.vertegenwoordigerNaam}
                            onChange={set('vertegenwoordigerNaam')}
                            error={errors.vertegenwoordigerNaam}
                            placeholder="bijv. dhr. J. de Vries"
                        />
                        <Field
                            label="Functie"
                            value={form.vertegenwoordigerFunctie}
                            onChange={set('vertegenwoordigerFunctie')}
                            error={errors.vertegenwoordigerFunctie}
                            placeholder="bijv. Rector / Directeur"
                        />
                        <Field
                            label="E-mailadres"
                            value={form.vertegenwoordigerEmail}
                            onChange={set('vertegenwoordigerEmail')}
                            error={errors.vertegenwoordigerEmail}
                            placeholder="bijv. directie@school.nl"
                            type="email"
                        />
                    </section>

                    {/* Ondertekening */}
                    <section className="bg-white rounded-2xl border border-duck-ink/15 p-6 space-y-4">
                        <h3 className="text-sm font-black text-duck-ink uppercase tracking-widest">
                            Ondertekening
                        </h3>
                        <Field
                            label="Plaats van ondertekening"
                            value={form.ondertekeningPlaats}
                            onChange={set('ondertekeningPlaats')}
                            error={errors.ondertekeningPlaats}
                            placeholder="bijv. Zwolle"
                        />
                        <Field
                            label="Datum"
                            value={form.ondertekeningDatum}
                            onChange={set('ondertekeningDatum')}
                            error={errors.ondertekeningDatum}
                            type="date"
                        />
                        <Field
                            label="DGSkills-ondertekenaar (bevestig naam)"
                            value={form.verwerkerVertegenwoordiger}
                            onChange={set('verwerkerVertegenwoordiger')}
                            error={errors.verwerkerVertegenwoordiger}
                            placeholder="bijv. Yorin Vonder"
                        />
                        <p className="text-xs text-duck-ink/50">
                            Controleer de juridische naam vóór generatie.
                        </p>
                    </section>

                    {/* Submit */}
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={generating}
                            className={[
                                'flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm',
                                'uppercase tracking-widest transition-all duration-200',
                                generating
                                    ? 'bg-duck-ink/30 text-duck-ink/50 cursor-not-allowed'
                                    : 'bg-duck-ink text-white hover:opacity-90 shadow-sm',
                            ].join(' ')}
                        >
                            {generating ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Genereren…
                                </>
                            ) : (
                                'Genereer PDF'
                            )}
                        </button>

                        {success && (
                            <p className="text-sm font-bold text-duck-ink">
                                PDF gegenereerd en gedownload.
                            </p>
                        )}
                    </div>
                </form>

                {/* Info-paneel DGSkills + subverwerkers */}
                <aside className="space-y-6">
                    <div className="bg-duck-ink rounded-2xl p-6 text-white">
                        <h3 className="text-xs font-black uppercase tracking-widest text-duck-acid mb-4">
                            DGSkills (Verwerker) — vooringevuld
                        </h3>
                        <dl className="space-y-2">
                            {DGSKILLS_INFO.map(([veld, waarde]) => (
                                <div key={veld}>
                                    <dt className="text-[10px] font-black text-white/50 uppercase tracking-wider">{veld}</dt>
                                    <dd className="text-xs font-medium text-white/90">{waarde}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div className="bg-white rounded-2xl border border-duck-ink/15 p-6">
                        <h3 className="text-xs font-black text-duck-ink uppercase tracking-widest mb-4">
                            Sub-verwerkers — vooringevuld
                        </h3>
                        <ul className="space-y-3">
                            {SUBVERWERKERS_INFO.map(sv => (
                                <li key={sv.naam} className="border-b border-duck-ink/10 pb-3 last:border-0 last:pb-0">
                                    <p className="text-xs font-bold text-duck-ink">{sv.naam}</p>
                                    <p className="text-[10px] text-duck-ink/60">{sv.dienst}</p>
                                    <p className="text-[10px] text-duck-ink/50">{sv.locatie}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};
