import React, { useState, useEffect, useRef } from 'react';
import { X, Zap, Sparkles, TrendingUp, Check, Loader2 } from 'lucide-react';
import { StudentData } from '../../types';
import { awardXP } from '../../services/teacherService';
import { motion, AnimatePresence } from 'framer-motion';

interface AwardXPModalProps {
    student: StudentData | null;
    onClose: () => void;
    onSuccess?: () => void;
}

const QUICK_AMOUNTS = [5, 10, 25, 50, 100];

export const AwardXPModal: React.FC<AwardXPModalProps> = ({ student, onClose, onSuccess }) => {
    const [amount, setAmount] = useState(10);
    const [isAwarding, setIsAwarding] = useState(false);
    const [success, setSuccess] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (student) {
            setAmount(10);
            setSuccess(false);
            setTimeout(() => inputRef.current?.select(), 100);
        }
    }, [student]);

    if (!student) return null;

    const handleAward = async () => {
        if (amount <= 0 || isNaN(amount)) return;

        setIsAwarding(true);
        try {
            await awardXP(student.uid, amount, student.displayName || 'Leerling');
            setSuccess(true);
            onSuccess?.();

            // Auto-close after success
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Error awarding XP:', error);
        } finally {
            setIsAwarding(false);
        }
    };

    const currentXP = student.stats?.xp || 0;
    const newXP = currentXP + amount;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
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
                    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 px-6 py-5 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]"></div>
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <Zap size={24} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black">XP Toekennen</h2>
                                    <p className="text-white/80 text-xs font-medium">{student.displayName}</p>
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
                        {!success ? (
                            <>
                                {/* Current XP Display */}
                                <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Huidige XP</p>
                                        <p className="text-2xl font-black text-slate-900">{currentXP.toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-emerald-600">
                                        <TrendingUp size={20} />
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Na toekenning</p>
                                            <p className="text-xl font-black">{newXP.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Amount Input */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                                        Aantal XP
                                    </label>
                                    <div className="relative">
                                        <input
                                            ref={inputRef}
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
                                            min="1"
                                            className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-2xl font-black text-center
                                                     focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500">
                                            <Sparkles size={24} />
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Amount Buttons */}
                                <div className="flex flex-wrap gap-2">
                                    {QUICK_AMOUNTS.map((quickAmount) => (
                                        <button
                                            key={quickAmount}
                                            onClick={() => setAmount(quickAmount)}
                                            className={`flex-1 min-w-[60px] py-2.5 rounded-xl font-bold text-sm transition-all ${amount === quickAmount
                                                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700'
                                                }`}
                                        >
                                            +{quickAmount}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="py-8 text-center"
                            >
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check size={32} className="text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">XP Toegekend!</h3>
                                <p className="text-slate-500">
                                    <span className="font-bold text-amber-600">+{amount} XP</span> voor {student.displayName}
                                </p>
                            </motion.div>
                        )}
                    </div>

                    {/* Footer */}
                    {!success && (
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2.5 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                Annuleren
                            </button>
                            <button
                                onClick={handleAward}
                                disabled={isAwarding || amount <= 0}
                                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm rounded-xl 
                                         hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed 
                                         transition-all flex items-center gap-2 shadow-lg shadow-amber-200"
                            >
                                {isAwarding ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Bezig...
                                    </>
                                ) : (
                                    <>
                                        <Zap size={16} />
                                        +{amount} XP Toekennen
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
