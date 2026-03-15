import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, MailWarning, ShieldCheck } from 'lucide-react';
import {
  CONSENT_META,
  approveParentalConsentRequest,
  previewParentalConsentRequest,
  type ParentalConsentRequestPreview,
} from '../services/consentService';

function formatConsentLabel(consentType: keyof typeof CONSENT_META) {
  return CONSENT_META[consentType].label;
}

export function ParentConsentApproval() {
  const [token, setToken] = useState<string | null>(null);
  const [preview, setPreview] = useState<ParentalConsentRequestPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const queryToken = url.searchParams.get('token')?.trim();

    if (!queryToken) {
      setError('Deze toestemmingslink is ongeldig of onvolledig.');
      setLoading(false);
      return;
    }

    setToken(queryToken);
    window.history.replaceState({}, '', '/ouderlijke-toestemming');

    previewParentalConsentRequest(queryToken)
      .then((data) => {
        setPreview(data);
      })
      .catch((err: any) => {
        setError(err.message || 'Deze toestemmingsaanvraag is verlopen of ongeldig.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleApprove = async () => {
    if (!token || approving) return;

    setApproving(true);
    setError(null);

    try {
      const data = await approveParentalConsentRequest(token);
      setPreview(data);
    } catch (err: any) {
      setError(err.message || 'Kon de toestemming niet bevestigen.');
    } finally {
      setApproving(false);
    }
  };

  const isApproved = preview?.status === 'approved';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(217,119,87,0.12),_transparent_45%),linear-gradient(180deg,#FAF9F0_0%,#FFFFFF_100%)] px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-8 md:p-10">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
            isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
          }`}>
            {loading ? <Loader2 className="animate-spin" size={30} /> : isApproved ? <CheckCircle2 size={30} /> : <ShieldCheck size={30} />}
          </div>

          <h1 className="text-3xl font-black text-slate-900 mb-3">
            {isApproved ? 'Toestemming bevestigd' : 'Ouderlijke toestemming DGSkills'}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed mb-8">
            {isApproved
              ? 'De geselecteerde toestemmingen zijn veilig vastgelegd. De leerling kan deze onderdelen nu gebruiken binnen DGSkills.'
              : 'Controleer hieronder de aanvraag en bevestig alleen als u ouder, voogd of verzorger van de leerling bent.'}
          </p>

          {loading && (
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <Loader2 className="animate-spin" size={18} />
              Aanvraag laden...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
              <MailWarning size={18} className="text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-800 leading-relaxed">{error}</p>
            </div>
          )}

          {!loading && preview && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard label="Ouder/verzorger" value={preview.parentName} />
                <InfoCard label="Leerling" value={preview.studentName} />
                <InfoCard label="School" value={preview.schoolName} />
                <InfoCard
                  label="Geldig tot"
                  value={new Date(preview.expiresAt).toLocaleString('nl-NL', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500 mb-3">Toestemmingen</p>
                <div className="space-y-3">
                  {preview.consentTypes.map((consentType) => (
                    <div key={consentType} className="rounded-xl bg-white border border-slate-200 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">{formatConsentLabel(consentType)}</p>
                      <p className="text-xs text-slate-500 mt-1">{CONSENT_META[consentType].description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                <p className="text-xs text-indigo-900 leading-relaxed">
                  Door te bevestigen wordt de toestemming server-side vastgelegd met een eenmalige, beveiligde token.
                  U kunt later via de leerlinginstellingen opnieuw intrekken.
                </p>
              </div>

              <button
                type="button"
                onClick={handleApprove}
                disabled={approving || isApproved}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-white px-5 py-4 text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {approving ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                {isApproved ? 'Toestemming al bevestigd' : 'Bevestig toestemming'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default ParentConsentApproval;
