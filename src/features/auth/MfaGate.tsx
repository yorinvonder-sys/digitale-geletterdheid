/**
 * MFA Gate — Cbw/NIS2 Art. 21 Compliance
 *
 * Blocks privileged users (teacher/admin/developer) from accessing the app
 * until they have completed MFA enrollment and verification (AAL2).
 */
import React, { useState, useEffect } from 'react';
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
            <div className="fixed inset-0 flex items-center justify-center bg-[#FCF6EA] text-[#08283B]">
                <div className="flex flex-col items-center gap-4 relative z-10">
                    <div className="w-16 h-16 mx-auto">
                        <img src="/logo.webp" alt="DGSkills" className="w-full h-full object-contain" width={64} height={64} decoding="async" />
                    </div>
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E7D8BD] border-t-[#0B453F]" />
                    <p className="text-sm font-semibold text-[#445865]">MFA-status controleren...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 overflow-hidden bg-[#FCF6EA] font-sans text-[#08283B]">
            <div className="absolute inset-0 pointer-events-none">
                <img
                    src="/assets/brand/dgskills-duck-guide-v3.png"
                    alt=""
                    className="h-full w-full object-cover opacity-80"
                    width={1536}
                    height={864}
                    aria-hidden="true"
                    decoding="async"
                />
                <div className="absolute inset-0 bg-[#FCF6EA]/25" />
            </div>

            <div className="absolute inset-0 overflow-y-auto flex items-center justify-center p-6">
                <div className="max-w-md w-full relative z-10 my-auto">
                    <div className="rounded-[1.75rem] border border-[#E7D8BD] bg-[#FFFDF7]/95 p-8 shadow-[0_28px_80px_rgba(8,40,59,0.13)] md:p-10">

                        {/* Header met logo */}
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 mx-auto mb-4">
                                <img src="/assets/brand/dgskills-duck-guide-v3.png" alt="DGSkills eend met 2FA" className="w-full h-full object-contain" width={96} height={96} decoding="async" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-[#08283B]">
                                Verificatie <span className="text-[#D97848]">vereist</span>
                            </h1>
                            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#445865]">
                                Tweefactorauthenticatie • Cbw/NIS2
                            </p>
                        </div>

                        <p className="text-sm font-semibold text-center mb-6 leading-relaxed text-[#445865]">
                            Als docent of beheerder is tweefactorauthenticatie (MFA) verplicht
                            om de gegevens van leerlingen te beschermen.
                        </p>

                        {error && (
                            <div className="flex items-start gap-2 rounded-xl border border-[#D97848]/25 bg-[#D97848]/10 p-3 mb-5 animate-in shake">
                                <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-[#D97848]" />
                                <p className="text-xs font-bold text-[#08283B]">{error}</p>
                            </div>
                        )}

                        {step === 'enroll' && (
                            <div className="space-y-5">
                                <div className="rounded-2xl border border-[#E7D8BD] bg-[#FCF6EA] p-5">
                                    <p className="text-sm font-black text-[#08283B] mb-1">
                                        1. Scan de QR-code
                                    </p>
                                    <p className="text-xs font-semibold text-[#445865] mb-4">
                                        Gebruik Google Authenticator, Microsoft Authenticator of een andere TOTP-app.
                                    </p>
                                    {qrCode && (
                                        <div className="flex justify-center mb-4">
                                            <div className="rounded-2xl border border-[#E7D8BD] bg-[#FFFDF7] p-3 shadow-sm">
                                                <img
                                                    src={qrCode}
                                                    alt="MFA QR Code"
                                                    className="w-44 h-44 rounded-lg"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 truncate rounded-lg border border-[#E7D8BD] bg-[#FFFDF7] px-3 py-2 font-mono text-xs text-[#445865]">
                                            {secret}
                                        </code>
                                        <button
                                            onClick={handleCopySecret}
                                            className="flex items-center gap-1.5 rounded-lg border border-[#E7D8BD] px-3 py-2 text-xs font-black text-[#0B453F] transition-colors hover:bg-[#D7C95F]/20"
                                            title="Kopieer geheime sleutel"
                                        >
                                            {copiedSecret ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                            {copiedSecret ? 'Gekopieerd!' : 'Kopieer'}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-black text-[#08283B] mb-3">
                                        2. Voer de 6-cijferige code in
                                    </p>
                                    <div className="relative mb-3">
                                        <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#445865]" />
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
                                            className="w-full rounded-xl border border-[#E7D8BD] bg-[#FCF6EA] py-3.5 pl-12 pr-4 text-center font-mono text-lg tracking-widest text-[#08283B] outline-none transition-all focus:border-[#D97848] focus:ring-2 focus:ring-[#D97848]/20"
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        onClick={handleVerify}
                                        disabled={code.length !== 6 || verifying}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B453F] py-3.5 font-black text-white shadow-[0_4px_0_#08283B] transition-all hover:-translate-y-0.5 hover:bg-[#08283B] active:translate-y-0 active:shadow-[0_2px_0_#08283B] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {verifying ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                                <div className="rounded-2xl border border-[#E7D8BD] bg-[#D7C95F]/20 p-4 text-center">
                                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#FFFDF7] flex items-center justify-center">
                                        <ShieldCheck size={20} className="text-[#0B453F]" />
                                    </div>
                                    <p className="text-sm font-semibold text-[#08283B]">
                                        MFA is geactiveerd. Voer de code van je authenticator-app in.
                                    </p>
                                </div>

                                <div className="relative">
                                    <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#445865]" />
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
                                        className="w-full rounded-xl border border-[#E7D8BD] bg-[#FCF6EA] py-3.5 pl-12 pr-4 text-center font-mono text-lg tracking-widest text-[#08283B] outline-none transition-all focus:border-[#D97848] focus:ring-2 focus:ring-[#D97848]/20"
                                        autoFocus
                                    />
                                </div>

                                <button
                                    onClick={handleVerify}
                                    disabled={code.length !== 6 || verifying}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B453F] py-3.5 font-black text-white shadow-[0_4px_0_#08283B] transition-all hover:-translate-y-0.5 hover:bg-[#08283B] active:translate-y-0 active:shadow-[0_2px_0_#08283B] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {verifying ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <ShieldCheck size={18} />
                                    )}
                                    Verifieer
                                </button>
                            </div>
                        )}

                        <div className="mt-8 border-t border-[#E7D8BD] pt-5 text-center">
                            <button
                                onClick={() => logout()}
                                className="text-xs font-black text-[#445865] transition-colors hover:text-[#D97848]"
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
