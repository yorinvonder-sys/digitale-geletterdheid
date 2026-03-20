/**
 * MFA Gate — Cbw/NIS2 Art. 21 Compliance
 *
 * Blocks privileged users (teacher/admin/developer) from accessing the app
 * until they have completed MFA enrollment and verification (AAL2).
 */
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Loader2, AlertTriangle, CheckCircle2, Copy, KeyRound } from 'lucide-react';
import { enrollMfa, verifyMfa, getMfaStatus, logout } from '../services/authService';
import { createMfaTrust } from '../services/mfaTrustService';

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
            <div className="fixed inset-0 bg-slate-50 flex items-center justify-center">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-50 pointer-events-none" />
                <div className="flex flex-col items-center gap-4 relative z-10">
                    <div className="w-16 h-16 mx-auto">
                        <img src="/mascot/pip-logo.webp" alt="DGSkills" className="w-full h-full object-contain" width={64} height={64} decoding="async" />
                    </div>
                    <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-slate-400 text-sm font-medium">MFA-status controleren...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-50 font-sans overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-50 pointer-events-none" />

            <div className="absolute inset-0 overflow-y-auto flex items-center justify-center p-6">
                <div className="max-w-md w-full relative z-10 my-auto">
                    <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-100 p-8 md:p-10 border border-slate-100">

                        {/* Header met logo */}
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 mx-auto mb-4">
                                <img src="/mascot/pip-2fa.png" alt="Pip met telefoon" className="w-full h-full object-contain" width={96} height={96} decoding="async" />
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">
                                Verificatie <span className="text-lab-primary">vereist</span>
                            </h1>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                Tweefactorauthenticatie • Cbw/NIS2
                            </p>
                        </div>

                        <p className="text-slate-500 text-sm text-center mb-6 leading-relaxed">
                            Als docent of beheerder is tweefactorauthenticatie (MFA) verplicht
                            om de gegevens van leerlingen te beschermen.
                        </p>

                        {error && (
                            <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3 mb-5 animate-in shake">
                                <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-xs font-bold text-red-500">{error}</p>
                            </div>
                        )}

                        {step === 'enroll' && (
                            <div className="space-y-5">
                                <div className="bg-slate-50 rounded-2xl p-5">
                                    <p className="text-sm font-bold text-slate-700 mb-1">
                                        1. Scan de QR-code
                                    </p>
                                    <p className="text-xs text-slate-400 mb-4">
                                        Gebruik Google Authenticator, Microsoft Authenticator of een andere TOTP-app.
                                    </p>
                                    {qrCode && (
                                        <div className="flex justify-center mb-4">
                                            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                                                <img
                                                    src={qrCode}
                                                    alt="MFA QR Code"
                                                    className="w-44 h-44 rounded-lg"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 font-mono text-slate-500 truncate">
                                            {secret}
                                        </code>
                                        <button
                                            onClick={handleCopySecret}
                                            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 px-3 py-2 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors"
                                            title="Kopieer geheime sleutel"
                                        >
                                            {copiedSecret ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                            {copiedSecret ? 'Gekopieerd!' : 'Kopieer'}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-slate-700 mb-3">
                                        2. Voer de 6-cijferige code in
                                    </p>
                                    <div className="relative mb-3">
                                        <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
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
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        onClick={handleVerify}
                                        disabled={code.length !== 6 || verifying}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200/50 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
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
                                <div className="bg-indigo-50 rounded-2xl p-4 text-center">
                                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <ShieldCheck size={20} className="text-indigo-600" />
                                    </div>
                                    <p className="text-sm font-medium text-indigo-700">
                                        MFA is geactiveerd. Voer de code van je authenticator-app in.
                                    </p>
                                </div>

                                <div className="relative">
                                    <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
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
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        autoFocus
                                    />
                                </div>

                                <button
                                    onClick={handleVerify}
                                    disabled={code.length !== 6 || verifying}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200/50 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
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

                        <div className="mt-8 pt-5 border-t border-slate-100 text-center">
                            <button
                                onClick={() => logout()}
                                className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
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
