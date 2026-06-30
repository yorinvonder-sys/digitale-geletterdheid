import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Check, Calendar } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { getCurrentSchoolYear } from '@/services/assessmentService';
import { Toast } from '@/components/app-shell/Toast';

interface EindmetingReleaseButtonProps {
  classFilter: string;
  schoolId?: string;
  availableClasses: string[];
}

interface EindmetingRelease {
  student_class: string;
  released_at: string;
}

export const EindmetingReleaseButton: React.FC<EindmetingReleaseButtonProps> = ({
  classFilter,
  schoolId,
  availableClasses,
}) => {
  const [releases, setReleases] = useState<EindmetingRelease[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const schoolYear = getCurrentSchoolYear();

  useEffect(() => {
    fetchReleases();
  }, [schoolId, schoolYear]);

  async function fetchReleases() {
    const query = (supabase as any)
      .from('eindmeting_releases')
      .select('student_class, released_at')
      .eq('school_year', schoolYear);

    if (schoolId) {
      query.eq('school_id', schoolId);
    }

    const { data, error } = await query;
    if (!error && data) {
      setReleases(data as EindmetingRelease[]);
    }
  }

  function getReleaseForClass(cls: string): EindmetingRelease | undefined {
    return releases.find((r) => r.student_class === cls);
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  async function handleRelease(targetClass: string) {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await (supabase as any).from('eindmeting_releases').insert({
      school_id: schoolId ?? null,
      school_year: schoolYear,
      student_class: targetClass,
      released_by: user?.id ?? null,
    });

    setLoading(false);

    if (error) {
      setToast({ message: 'Vrijgeven mislukt. Probeer het opnieuw.', type: 'error' });
    } else {
      await fetchReleases();
      setToast({ message: `Eindmeting vrijgegeven voor ${targetClass}.`, type: 'success' });
    }
  }

  const targetClass = classFilter !== 'all' ? classFilter : selectedClass;
  const releaseRecord = targetClass ? getReleaseForClass(targetClass) : undefined;
  const alreadyReleased = !!releaseRecord;

  return (
    <>
      <div className="bg-white rounded-2xl border border-duck-ink/15 p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-duck-error rounded-xl">
            <ClipboardCheck size={18} className="text-duck-error" />
          </div>
          <div>
            <h3 className="text-sm font-black text-duck-ink">Eindmeting vrijgeven</h3>
            <p className="text-xs text-duck-ink/60 mt-0.5">
              Geef de eindmeting vrij voor een klas. Leerlingen zien de eindmeting bij hun volgende
              login.
            </p>
          </div>
        </div>

        {classFilter === 'all' && (
          <div className="mb-4">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-3 border border-duck-ink/15 rounded-xl text-sm font-bold bg-white hover:border-duck-error focus:border-duck-error focus:ring-2 focus:ring-duck-error/20 outline-none transition-all cursor-pointer"
            >
              <option value="">-- Selecteer een klas --</option>
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                  {getReleaseForClass(cls) ? ' (vrijgegeven)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {targetClass && alreadyReleased && (
          <div className="flex items-center gap-2 px-4 py-3 bg-duck-ink border border-duck-ink rounded-xl">
            <Check size={16} className="text-duck-ink flex-shrink-0" />
            <div>
              <span className="text-sm font-bold text-duck-ink">Vrijgegeven</span>
              <span className="text-xs text-duck-ink flex items-center gap-1 mt-0.5">
                <Calendar size={11} />
                {formatDate(releaseRecord!.released_at)}
              </span>
            </div>
          </div>
        )}

        {targetClass && !alreadyReleased && (
          <button
            type="button"
            disabled={loading}
            onClick={() => handleRelease(targetClass)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-duck-error hover:bg-duck-error hover:text-white disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-black rounded-xl transition-colors"
          >
            <ClipboardCheck size={16} />
            {loading ? 'Bezig...' : `Eindmeting vrijgeven voor ${targetClass}`}
          </button>
        )}

        {!targetClass && classFilter === 'all' && (
          <div className="px-4 py-3 bg-duck-bg text-duck-ink/60 text-sm rounded-xl text-center">
            Selecteer eerst een klas.
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  );
};
