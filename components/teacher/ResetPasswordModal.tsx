import React, { useState, useEffect, useRef } from 'react';
import { X, KeyRound, Check, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { StudentData } from '../../types';
import { resetStudentPassword } from '../../services/teacherService';
import { motion, AnimatePresence } from 'framer-motion';

interface ResetPasswordModalProps {
    student: StudentData | null;
    onClose: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ student, onClose }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (student) {
            setPassword('');
            setResult(null);
            setTimeout(() => inputRef.current?.select(), 100);
        }
    }, [student]);

    if (!student) return null;

    const handleReset = async () => {
        if (!password.trim()) return;

        setIsResetting(true);
        try {
            const ok = await resetStudentPassword(student.uid, password);
            if (ok) {
                setResult({
                    success: true,
                    message: `Wachtwoord succesvol gereset voor ${student.displayName}. Deel het nieuwe wachtwoord veilig met de leerling.`
                });
            }
        } catch (error: any) {
            setResult({
                success: false,
                message: error.message || 'Er ging iets mis bij het resetten.'
            });
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <KeyRound size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black">Wachtwoord Resetten</h2>
                                    <p className="text-white/70 text-xs font-medium">{student.displayName}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-5">
                        {!result ? (
                            <>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                                        Nieuw Wachtwoord
                                    </label>
                                    <div className="relative">
                                        <input
                                            ref={inputRef}
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Voer nieuw wachtwoord in..."
                                            className="w-full px-4 py-3 pr-12 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium 
                                                     focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        De leerling moet dit wachtwoord wijzigen bij de volgende keer inloggen.
                                    </p>
                                </div>

                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <div className="flex gap-3">
                                        <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-amber-800">Let op</p>
                                            <p className="text-xs text-amber-700 mt-0.5">
                                                Het huidige wachtwoord van {student.displayName} wordt overschreven.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className={`rounded-xl p-5 ${result.success ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${result.success ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                        {result.success ? <Check size={20} /> : <AlertCircle size={20} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-bold text-sm ${result.success ? 'text-emerald-800' : 'text-red-800'}`}>
                                            {result.success ? 'Succes!' : 'Fout'}
                                        </p>
                                        <p className={`text-xs mt-0.5 ${result.success ? 'text-emerald-700' : 'text-red-700'}`}>
                                            {result.message}
                                        </p>

                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            {result ? 'Sluiten' : 'Annuleren'}
                        </button>
                        {!result && (
                            <button
                                onClick={handleReset}
                                disabled={isResetting || !password.trim()}
                                className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 
                                         disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-indigo-200"
                            >
                                {isResetting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Bezig...
                                    </>
                                ) : (
                                    <>
                                        <KeyRound size={16} />
                                        Reset Wachtwoord
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
