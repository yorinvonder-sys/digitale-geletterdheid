/**
 * MFA Gate — Cbw/NIS2 Art. 21 Compliance
 *
 * Blocks privileged users (teacher/admin/developer) from accessing the app
 * until they have completed MFA enrollment and verification (AAL2).
 */
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Loader2, AlertTriangle, CheckCircle2, Copy, KeyRound } from 'lucide-react';
import { enrollMfa, verifyMfa, getMfaStatus, logout } from '../services/authService';

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
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={48} className="animate-spin text-indigo-600" />
                    <p className="text-slate-500 font-medium">MFA-status controleren...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 max-w-md w-full p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <ShieldCheck size={24} className="text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">
                            Tweefactorauthenticatie vereist
                        </h1>
                        <p className="text-sm text-slate-500">
                            Cbw/NIS2 beveiligingsvereiste
                        </p>
                    </div>
                </div>

                <p className="text-slate-600 text-sm mb-6">
                    Als docent of beheerder is tweefactorauthenticatie (MFA) verplicht
                    om de gegevens van leerlingen te beschermen.
                </p>

                {error && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {step === 'enroll' && (
                    <div className="space-y-4">
                        <div className="bg-slate-50 rounded-lg p-4">
                            <p className="text-sm font-medium text-slate-700 mb-3">
                                1. Scan de QR-code met een authenticator-app
                            </p>
                            <p className="text-xs text-slate-500 mb-3">
                                Gebruik Google Authenticator, Microsoft Authenticator of een andere TOTP-app.
                            </p>
                            {qrCode && (
                                <div className="flex justify-center mb-3">
                                    <img
                                        src={qrCode}
                                        alt="MFA QR Code"
                                        className="w-48 h-48 rounded-lg border border-slate-200"
                                    />
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <code className="flex-1 text-xs bg-white border border-slate-200 rounded px-2 py-1.5 font-mono text-slate-600 truncate">
                                    {secret}
                                </code>
                                <button
                                    onClick={handleCopySecret}
                                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 px-2 py-1.5 rounded border border-indigo-200 hover:bg-indigo-50 transition-colors"
                                    title="Kopieer geheime sleutel"
                                >
                                    {copiedSecret ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                    {copiedSecret ? 'Gekopieerd' : 'Kopieer'}
                                </button>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-700 mb-2">
                                2. Voer de 6-cijferige code in
                            </p>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        autoFocus
                                    />
                                </div>
                                <button
                                    onClick={handleVerify}
                                    disabled={code.length !== 6 || verifying}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    {verifying ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <ShieldCheck size={16} />
                                    )}
                                    Activeer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'verify' && (
                    <div className="space-y-4">
                        <div className="bg-indigo-50 rounded-lg p-4">
                            <p className="text-sm text-indigo-700">
                                MFA is geactiveerd. Voer de code van je authenticator-app in om door te gaan.
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    autoFocus
                                />
                            </div>
                            <button
                                onClick={handleVerify}
                                disabled={code.length !== 6 || verifying}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                {verifying ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <ShieldCheck size={16} />
                                )}
                                Verifieer
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-6 pt-4 border-t border-slate-200">
                    <button
                        onClick={() => logout()}
                        className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        Uitloggen en later terugkomen
                    </button>
                </div>
            </div>
        </div>
    );
}
