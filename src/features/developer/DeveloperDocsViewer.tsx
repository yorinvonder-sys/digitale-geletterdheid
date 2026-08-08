import React, { Suspense, useEffect, useState } from 'react';
import { ArrowLeft, FileText, Loader2, AlertCircle, GraduationCap, FolderOpen } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';

const DeveloperCodeAcademy = React.lazy(() => import('./DeveloperCodeAcademy').then((module) => ({ default: module.DeveloperCodeAcademy })));

const BUCKET = 'internal-docs';
const FOLDER = 'overdracht';

const DOC_LABELS: Record<string, string> = {
  '00-eigenaarschaps-besluit.md': 'Eigenaarschapsbesluit',
  '01-juridisch-dossier-voor-school.md': 'Juridisch dossier (FG)',
  '02-kosten-overdracht.md': 'Kosten & overdracht',
  '03-pilot-propositie-school.md': 'Pilot-propositie schoolleiding',
};

type DocsMode = 'academy' | 'documents';

function InternalDocuments() {
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
        setFiles((data ?? []).map((file) => file.name).filter((name) => name.endsWith('.md')));
      }
      setLoading(false);
    }
    void fetchList();
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
      <div className="flex h-48 items-center justify-center text-lab-muted">
        <Loader2 size={24} className="mr-2 animate-spin" />
        <span className="text-sm">Documenten laden…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-4 rounded-3xl border border-lab-line bg-white p-8">
        <AlertCircle size={22} className="mt-0.5 shrink-0 text-red-500" />
        <div>
          <p className="text-sm font-bold text-lab-ink">Geen toegang tot interne documenten</p>
          <p className="mt-1 text-sm text-lab-muted">{error}</p>
          <p className="mt-2 text-xs text-lab-muted">
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
          className="flex items-center gap-2 text-sm text-lab-muted transition-colors hover:text-lab-ink"
        >
          <ArrowLeft size={16} />
          Terug naar overzicht
        </button>

        <div className="rounded-3xl border border-lab-line bg-white p-8 shadow-sm md:p-10">
          <h2 className="mb-6 text-lg font-black text-lab-ink">
            {DOC_LABELS[activeFile] ?? activeFile}
          </h2>

          {contentLoading ? (
            <div className="flex items-center gap-2 text-sm text-lab-muted">
              <Loader2 size={16} className="animate-spin" />
              Laden…
            </div>
          ) : (
            <div className="prose prose-sm max-w-none text-lab-ink prose-headings:font-black prose-headings:text-lab-ink prose-strong:text-lab-ink prose-code:text-xs prose-table:text-sm prose-th:text-left prose-th:font-bold prose-td:align-top">
              <MarkdownRenderer>{content ?? ''}</MarkdownRenderer>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="rounded-3xl border border-lab-line bg-white p-8 shadow-sm md:p-10">
        <h2 className="mb-2 text-xl font-black text-lab-ink">Overdrachtsdocumenten</h2>
        <p className="mb-6 text-sm text-lab-muted">
          Interne documenten voor de overdracht van DGSkills aan Almere College.
          Alleen zichtbaar voor developer- en admin-accounts.
        </p>

        {files.length === 0 ? (
          <p className="text-sm italic text-lab-muted">
            Geen documenten gevonden. Voer eerst{' '}
            <code className="rounded bg-lab-line px-1 py-0.5 text-xs">
              node scripts/upload-internal-docs.mjs
            </code>{' '}
            uit om de documenten te uploaden.
          </p>
        ) : (
          <ul className="space-y-2">
            {files.map((filename) => (
              <li key={filename}>
                <button
                  onClick={() => void openDoc(filename)}
                  className="group flex w-full items-center gap-3 rounded-2xl border border-lab-line p-4 text-left transition-all hover:border-lab-teal/50 hover:bg-lab-teal/5"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-lab-teal/15 transition-colors group-hover:bg-lab-teal/25">
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

export function DeveloperDocsViewer() {
  const [mode, setMode] = useState<DocsMode>('academy');

  return (
    <div className="space-y-6 pt-6">
      <div className="inline-flex w-full gap-2 rounded-2xl border border-duck-ink/15 bg-white p-2 shadow-sm sm:w-auto">
        <button
          onClick={() => setMode('academy')}
          className={`flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-black transition-colors sm:flex-none ${mode === 'academy' ? 'bg-duck-ink text-white' : 'text-duck-ink/60 hover:bg-duck-bgLight hover:text-duck-ink'}`}
        >
          <GraduationCap size={19} />
          Code Academie
        </button>
        <button
          onClick={() => setMode('documents')}
          className={`flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-black transition-colors sm:flex-none ${mode === 'documents' ? 'bg-duck-ink text-white' : 'text-duck-ink/60 hover:bg-duck-bgLight hover:text-duck-ink'}`}
        >
          <FolderOpen size={19} />
          Interne documenten
        </button>
      </div>

      {mode === 'academy' ? (
        <Suspense fallback={<div className="flex h-48 items-center justify-center"><Loader2 className="animate-spin text-duck-ink" /></div>}>
          <DeveloperCodeAcademy />
        </Suspense>
      ) : (
        <InternalDocuments />
      )}
    </div>
  );
}
