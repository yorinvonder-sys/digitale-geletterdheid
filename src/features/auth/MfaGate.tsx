/**
 * MFA Gate — Cbw/NIS2 Art. 21 Compliance
 *
 * Blocks privileged users (teacher/admin/developer) from accessing the app
 * until they have completed MFA enrollment and verification (AAL2).
 */
import React, { useState, useEffect } from 'react';
import { DuckMark } from '@/components/brand/DuckMark';
import { ShieldCheck, Loader2, AlertTriangle, CheckCircle2, Copy, KeyRound } from 'lucide-react';
import { enrollMfa, verifyMfa, getMfaStatus, logout } from '@/services/authService';
import { createMfaTrust } from '@/services/mfaTrustService';

interface MfaGateProps {
    onVerified: () => void;
}

export function MfaGate({ onVerified }: MfaGateProps) {
    const [step, setStep] = useState<'loading' | 'enroll' | 'verify'>('loading');
    const [qrCode, setQrCode] = useState<string>('');
    const [secret, setSecret] = useState<string>('');
    const [factorId, setFactorId] = useState<string>('');
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [verifying, setVerifying] = useState(false);
    const [copiedSecret, setCopiedSecret] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    // Guard against React StrictMode double-invocation of useEffect
    const initiated = React.useRef(false);

    useEffect(() => {
        if (initiated.current) return;
        initiated.current = true;
        checkMfaStatus();
    }, []);

    const checkMfaStatus = async () => {
        try {
            const status = await getMfaStatus();

            if (status.isVerified) {
                onVerified();
                return;
            }

            if (status.isEnrolled && status.factors.length > 0) {
                setFactorId(status.factors[0].id);
                setStep('verify');
            } else {
                await startEnrollment();
            }
        } catch {
            await startEnrollment();
        }
    };

    const startEnrollment = async () => {
        try {
            const enrollment = await enrollMfa();
            setQrCode(enrollment.qrCode);
            setSecret(enrollment.secret);
            setFactorId(enrollment.id);
            setStep('enroll');
        } catch (err: any) {
            setError(err.message || 'MFA activeren mislukt.');
        }
    };

    const handleVerify = async () => {
        if (code.length !== 6 || !/^\d{6}$/.test(code)) {
            setError('Voer een 6-cijferige code in.');
            return;
        }

        setVerifying(true);
        setError(null);

        try {
            await verifyMfa(factorId, code);
            // Persist a recent-verification marker for additional risk checks.
            void createMfaTrust();
            onVerified();
        } catch (err: any) {
            setError(err.message || 'Verificatie mislukt. Probeer opnieuw.');
            setCode('');
        } finally {
            setVerifying(false);
        }
    };

    const handleCopySecret = () => {
        navigator.clipboard.writeText(secret).then(() => {
            setCopiedSecret(true);
            setTimeout(() => setCopiedSecret(false), 2000);
        });
    };

    if (step === 'loading') {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-duck-bg text-duck-ink">
                <div className="flex flex-col items-center gap-4 relative z-10">
                    <DuckMark className="size-16 mx-auto" />
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-duck-ink/20 border-t-duck-ink" />
                    <p className="text-sm font-semibold text-duck-ink/60">MFA-status controleren...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 overflow-hidden bg-duck-bg text-duck-ink">

            <div className="absolute inset-0 overflow-y-auto flex items-center justify-center p-6">
                <div className="max-w-md w-full relative z-10 my-auto">
                    <div className="rounded-[1.75rem] border border-duck-ink/15 bg-white p-8 shadow-duck-soft md:p-10">

                        {/* Header met logo */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4">
                                <DuckMark className="size-16" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-duck-ink">
                                Verificatie <span className="bg-duck-acid px-1">vereist</span>
                            </h1>
                            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-duck-ink/60">
                                Tweefactorauthenticatie • Cbw/NIS2
                            </p>
                        </div>

                        <p className="text-sm font-semibold text-center mb-6 leading-relaxed text-duck-ink/70">
                            Als docent of beheerder is tweefactorauthenticatie (MFA) verplicht
                            om de gegevens van leerlingen te beschermen.
                        </p>

                        {error && (
                            <div className="flex items-start gap-2 rounded-xl border border-duck-error/25 bg-duck-error/10 p-3 mb-5 animate-in shake">
                                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-duck-error" />
                                <p className="text-xs font-bold text-duck-ink">{error}</p>
                            </div>
                        )}

                        {step === 'enroll' && (
                            <div className="space-y-5">
                                <div className="rounded-2xl border border-duck-ink/15 bg-duck-bgLight p-5">
                                    <p className="text-sm font-black text-duck-ink mb-1">
                                        1. Scan de QR-code
                                    </p>
                                    <p className="text-xs font-semibold text-duck-ink/60 mb-4 leading-relaxed">
                                        Gebruik de codes-functie (6-cijferige code) van een TOTP-app:{' '}
                                        <span className="font-black text-duck-ink">Google Authenticator</span>,{' '}
                                        <span className="font-black text-duck-ink">2FAS</span>,{' '}
                                        <span className="font-black text-duck-ink">Ente Auth</span> of{' '}
                                        <span className="font-black text-duck-ink">Microsoft Authenticator</span>. Let op: bij
                                        Microsoft Authenticator gebruik je de 6-cijferige code, niet de
                                        "goedkeuren"-pushmelding.
                                    </p>
                                    {qrCode && (
                                        <div className="flex justify-center mb-4">
                                            <div className="rounded-2xl border border-duck-ink/15 bg-white p-3 shadow-sm">
                                                <img
                                                    src={qrCode}
                                                    alt="MFA QR Code"
                                                    className="w-44 h-44 rounded-lg"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 truncate rounded-lg border border-duck-ink/15 bg-white px-3 py-2 font-mono text-xs text-duck-ink/60">
                                            {secret}
                                        </code>
                                        <button
                                            onClick={handleCopySecret}
                                            className="flex items-center gap-1.5 rounded-lg border border-duck-ink/20 px-3 py-2 text-xs font-black text-duck-ink transition-colors hover:bg-duck-bgLight"
                                            title="Kopieer geheime sleutel"
                                        >
                                            {copiedSecret ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                            {copiedSecret ? 'Gekopieerd!' : 'Kopieer'}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-black text-duck-ink mb-3">
                                        2. Voer de 6-cijferige code in
                                    </p>
                                    <div className="relative mb-3">
                                        <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-duck-ink/50" />
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            placeholder="000000"
                                            value={code}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                setCode(val);
                                                setError(null);
                                            }}
                                            onKeyDown={(e) => e.key === 'Enter' && code.length === 6 && handleVerify()}
                                            className="w-full rounded-xl border-2 border-duck-ink/15 bg-white py-3.5 pl-12 pr-4 text-center font-mono text-lg tracking-widest text-duck-ink outline-none transition-all focus:border-duck-ink"
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        onClick={handleVerify}
                                        disabled={code.length !== 6 || verifying}
                                        className="flex w-full items-center justify-center gap-2 rounded-full bg-duck-ink py-3.5 font-black text-duck-acid shadow-[0_4px_0_rgba(0,0,0,0.25)] transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {verifying ? (
                                            <div className="w-5 h-5 border-2 border-duck-acid/30 border-t-duck-acid rounded-full animate-spin" />
                                        ) : (
                                            <ShieldCheck size={18} />
                                        )}
                                        MFA Activeren
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'verify' && (
                            <div className="space-y-5">
                                <div className="rounded-2xl border border-duck-ink/15 bg-duck-bgLight p-4 text-center">
                                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white flex items-center justify-center">
                                        <ShieldCheck size={20} className="text-duck-ink" />
                                    </div>
                                    <p className="text-sm font-semibold text-duck-ink">
                                        MFA is geactiveerd. Voer de code van je authenticator-app in.
                                    </p>
                                </div>

                                <div className="rounded-xl border border-duck-ink/15 bg-duck-bgLight p-3">
                                    <p className="text-xs font-semibold leading-relaxed text-duck-ink/70">
                                        Gebruik de <span className="font-black text-duck-ink">6-cijferige code</span> uit je
                                        authenticator-app — <span className="font-black text-duck-ink">niet</span> een
                                        "tik het getal aan"- of "goedkeuren"-melding. Die pushmelding hoort bij je
                                        Microsoft-account, niet bij DGSkills. Tik in je app op{' '}
                                        <span className="font-black text-duck-ink">DGSkills Authenticator</span> om de code te zien.
                                    </p>
                                </div>

                                <div className="relative">
                                    <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-duck-ink/50" />
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        placeholder="000000"
                                        value={code}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                            setCode(val);
                                            setError(null);
                                        }}
                                        onKeyDown={(e) => e.key === 'Enter' && code.length === 6 && handleVerify()}
                                        className="w-full rounded-xl border-2 border-duck-ink/15 bg-white py-3.5 pl-12 pr-4 text-center font-mono text-lg tracking-widest text-duck-ink outline-none transition-all focus:border-duck-ink"
                                        autoFocus
                                    />
                                </div>

                                <button
                                    onClick={handleVerify}
                                    disabled={code.length !== 6 || verifying}
                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-duck-ink py-3.5 font-black text-duck-acid shadow-[0_4px_0_rgba(0,0,0,0.25)] transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {verifying ? (
                                        <div className="w-5 h-5 border-2 border-duck-acid/30 border-t-duck-acid rounded-full animate-spin" />
                                    ) : (
                                        <ShieldCheck size={18} />
                                    )}
                                    Verifieer
                                </button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowHelp((v) => !v)}
                                        className="text-xs font-black text-duck-ink/50 transition-colors hover:text-duck-ink"
                                    >
                                        Code werkt niet?
                                    </button>
                                    {showHelp && (
                                        <div className="mt-3 space-y-2 rounded-xl border border-duck-ink/15 bg-duck-bgLight p-3 text-left">
                                            <p className="text-xs font-semibold leading-relaxed text-duck-ink/70">
                                                Zet de klok van je telefoon op{' '}
                                                <span className="font-black text-duck-ink">automatisch</span> — de code is
                                                tijdgebonden en verloopt elke 30 seconden.
                                            </p>
                                            <p className="text-xs font-semibold leading-relaxed text-duck-ink/70">
                                                Geen <span className="font-black text-duck-ink">DGSkills</span>-vermelding in
                                                je app? Dan moet je MFA opnieuw instellen — log uit en neem contact op met je
                                                beheerder.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 border-t border-duck-ink/10 pt-5 text-center">
                            <button
                                onClick={() => logout()}
                                className="text-xs font-black text-duck-ink/50 transition-colors hover:text-duck-ink"
                            >
                                Uitloggen en later terugkomen
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
