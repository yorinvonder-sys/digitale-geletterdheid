import React, { useEffect, useState } from 'react';
import { ArrowLeft, FileText, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';

const BUCKET = 'internal-docs';
const FOLDER = 'overdracht';

const DOC_LABELS: Record<string, string> = {
  '00-eigenaarschaps-besluit.md': 'Eigenaarschapsbesluit',
  '01-juridisch-dossier-voor-school.md': 'Juridisch dossier (FG)',
  '02-kosten-overdracht.md': 'Kosten & overdracht',
  '03-pilot-propositie-school.md': 'Pilot-propositie schoolleiding',
};

export function DeveloperDocsViewer() {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [contentLoading, setContentLoading] = useState(false);

  useEffect(() => {
    async function fetchList() {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase.storage
        .from(BUCKET)
        .list(FOLDER, { sortBy: { column: 'name', order: 'asc' } });

      if (err) {
        setError(err.message);
      } else {
        setFiles((data ?? []).map((f) => f.name).filter((n) => n.endsWith('.md')));
      }
      setLoading(false);
    }
    fetchList();
  }, []);

  async function openDoc(filename: string) {
    setActiveFile(filename);
    setContent(null);
    setContentLoading(true);

    const { data, error: err } = await supabase.storage
      .from(BUCKET)
      .download(`${FOLDER}/${filename}`);

    if (err || !data) {
      setContent(`_Fout bij laden: ${err?.message ?? 'onbekend'}_`);
    } else {
      setContent(await data.text());
    }
    setContentLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-lab-muted">
        <Loader2 size={24} className="animate-spin mr-2" />
        <span className="text-sm">Documenten laden…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl border border-lab-line p-8 flex items-start gap-4">
        <AlertCircle size={22} className="text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-lab-ink text-sm">Geen toegang tot interne documenten</p>
          <p className="text-lab-muted text-sm mt-1">{error}</p>
          <p className="text-lab-muted text-xs mt-2">
            Controleer of je ingelogd bent met een developer- of admin-account en of de bucket is aangemaakt.
          </p>
        </div>
      </div>
    );
  }

  if (activeFile) {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        <button
          onClick={() => { setActiveFile(null); setContent(null); }}
          className="flex items-center gap-2 text-sm text-lab-muted hover:text-lab-ink transition-colors"
        >
          <ArrowLeft size={16} />
          Terug naar overzicht
        </button>

        <div className="bg-white rounded-3xl border border-lab-line shadow-sm p-8 md:p-10">
          <h2 className="text-lg font-black text-lab-ink mb-6">
            {DOC_LABELS[activeFile] ?? activeFile}
          </h2>

          {contentLoading ? (
            <div className="flex items-center gap-2 text-lab-muted text-sm">
              <Loader2 size={16} className="animate-spin" />
              Laden…
            </div>
          ) : (
            <div className="prose prose-sm max-w-none text-lab-ink
              prose-headings:text-lab-ink prose-headings:font-black
              prose-strong:text-lab-ink prose-code:text-xs
              prose-table:text-sm prose-th:text-left prose-th:font-bold prose-td:align-top">
              <MarkdownRenderer>{content ?? ''}</MarkdownRenderer>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl border border-lab-line shadow-sm p-8 md:p-10">
        <h2 className="text-xl font-black text-lab-ink mb-2">Overdrachts­documenten</h2>
        <p className="text-sm text-lab-muted mb-6">
          Interne documenten voor de overdracht van DGSkills aan Almere College.
          Alleen zichtbaar voor developer- en admin-accounts.
        </p>

        {files.length === 0 ? (
          <p className="text-sm text-lab-muted italic">
            Geen documenten gevonden. Voer eerst{' '}
            <code className="text-xs bg-lab-line px-1 py-0.5 rounded">
              node scripts/upload-internal-docs.mjs
            </code>{' '}
            uit om de documenten te uploaden.
          </p>
        ) : (
          <ul className="space-y-2">
            {files.map((filename) => (
              <li key={filename}>
                <button
                  onClick={() => openDoc(filename)}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl border border-lab-line hover:border-lab-teal/50 hover:bg-lab-teal/5 transition-all text-left group"
                >
                  <div className="w-9 h-9 rounded-xl bg-lab-teal/15 flex items-center justify-center shrink-0 group-hover:bg-lab-teal/25 transition-colors">
                    <FileText size={18} className="text-lab-teal" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-lab-ink">
                      {DOC_LABELS[filename] ?? filename}
                    </p>
                    <p className="text-xs text-lab-muted">{filename}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
