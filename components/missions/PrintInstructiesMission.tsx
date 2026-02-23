/**
 * PrintInstructiesMission.tsx
 * 
 * Interactive step-by-step tutorial for opening a document in the Books app on iPad.
 * Simplified to 2 steps.
 */

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Printer, FileText, CheckCircle, BookOpen } from 'lucide-react';
import type { VsoProfile } from '../../types';

interface Props {
    onBack: () => void;
    onComplete: (success: boolean) => void;
    vsoProfile?: VsoProfile;
}

// Step data - Simplified instructions for opening a document in Books app
const STEPS = [
    {
        id: 1,
        title: 'Boeken App Openen',
        subtitle: 'Stap 1 van 2',
        icon: <BookOpen size={32} />,
        instruction: 'Open de app "Boeken" op je iPad. Dit is de standaard app van Apple om documenten en boeken te lezen.',
        visual: 'books-app',
        tip: '💡 De Boeken app heeft een oranje icoon met een open boek. Je vindt hem op je startscherm of in de App Bibliotheek.',
        checkText: 'Ik heb de Boeken app geopend'
    },
    {
        id: 2,
        title: 'Document Openen',
        subtitle: 'Stap 2 van 2',
        icon: <FileText size={32} />,
        instruction: 'Klik bovenin op "Bibliotheek" en open het printdocument dat je nodig hebt.',
        visual: 'library-open',
        tip: '💡 In de Bibliotheek vind je alle documenten en boeken die je hebt toegevoegd. Tik op het document om het te openen.',
        checkText: 'Ik heb het document geopend'
    }
];

// iPad Visual Component
const IPadVisual: React.FC<{ step: number }> = ({ step }) => {
    const renderScreen = () => {
        switch (step) {
            case 1:
                // Books app on home screen
                return (
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-4 rounded-lg w-full h-full flex flex-col items-center justify-center">
                        <div className="text-xs text-slate-500 mb-4">iPad Home</div>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="w-12 h-12 bg-slate-300 rounded-xl"></div>
                            <div className="w-12 h-12 bg-slate-300 rounded-xl"></div>
                            <div className="w-12 h-12 bg-slate-300 rounded-xl"></div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-3 w-16 h-16 flex items-center justify-center text-white mb-2 shadow-lg ring-4 ring-orange-300 animate-pulse">
                            <BookOpen size={28} />
                        </div>
                        <div className="text-[11px] font-bold text-slate-700">Boeken</div>
                        <div className="text-center mt-3">
                            <span className="inline-block text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                                ↑ Tik hier
                            </span>
                        </div>
                    </div>
                );
            case 2:
                // Library view in Books app
                return (
                    <div className="bg-white p-3 rounded-lg w-full h-full flex flex-col">
                        {/* Header with Library tab */}
                        <div className="flex items-center justify-center gap-4 mb-3 border-b border-slate-200 pb-2">
                            <span className="text-[10px] text-slate-400">Lezen</span>
                            <span className="text-[10px] font-bold text-orange-500 border-b-2 border-orange-500 pb-1">Bibliotheek</span>
                            <span className="text-[10px] text-slate-400">Winkel</span>
                        </div>
                        {/* Documents grid */}
                        <div className="flex-1 grid grid-cols-2 gap-2">
                            <div className="bg-slate-50 rounded-lg p-2 border border-orange-400 ring-2 ring-orange-200">
                                <div className="bg-slate-200 rounded h-12 mb-1 flex items-center justify-center">
                                    <FileText size={20} className="text-slate-400" />
                                </div>
                                <div className="text-[9px] font-bold text-slate-600 truncate">Printdocument</div>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-2 border border-slate-200">
                                <div className="bg-slate-200 rounded h-12 mb-1"></div>
                                <div className="text-[9px] text-slate-400 truncate">Ander doc</div>
                            </div>
                        </div>
                        <div className="text-center mt-2">
                            <span className="inline-block text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                                Tik op document
                            </span>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="relative mx-auto" style={{ maxWidth: '200px' }}>
            {/* iPad Frame */}
            <div className="relative bg-slate-800 rounded-[2rem] p-2 shadow-2xl">
                {/* Camera */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-700 rounded-full"></div>
                {/* Screen */}
                <div className="bg-slate-100 rounded-2xl overflow-hidden" style={{ height: '280px' }}>
                    <div className="p-2 h-full">
                        {renderScreen()}
                    </div>
                </div>
                {/* Home Button */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 border-2 border-slate-600 rounded-full"></div>
            </div>
        </div>
    );
};

export const PrintInstructiesMission: React.FC<Props> = ({ onBack, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const step = STEPS[currentStep];
    const isLastStep = currentStep === STEPS.length - 1;
    const canProceed = completedSteps.includes(step.id);

    const handleCheck = () => {
        if (!completedSteps.includes(step.id)) {
            setCompletedSteps([...completedSteps, step.id]);
        }
    };

    const handleNext = () => {
        if (isLastStep) {
            onComplete(true);
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const progress = ((completedSteps.length) / STEPS.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 text-white flex flex-col">
            {/* Header */}
            <header className="bg-slate-800/80 backdrop-blur border-b border-slate-700 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest"
                >
                    <ArrowLeft size={16} /> Terug
                </button>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 text-orange-400 rounded-xl">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black uppercase tracking-tight">
                            Document Openen
                        </h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                            Boeken App Tutorial
                        </p>
                    </div>
                </div>
                <div className="text-sm text-slate-400">
                    {currentStep + 1} / {STEPS.length}
                </div>
            </header>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2">
                <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 p-6 lg:p-12">
                {/* iPad Mockup */}
                <div className="lg:w-1/3">
                    <IPadVisual step={step.id} />
                </div>

                {/* Instructions */}
                <div className="lg:w-2/3 max-w-xl">
                    {/* Step Badge */}
                    <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                        {step.icon}
                        {step.subtitle}
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-black mb-4 text-white">{step.title}</h2>

                    {/* Instruction */}
                    <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                        {step.instruction}
                    </p>

                    {/* Tip */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
                        <p className="text-sm text-amber-200">{step.tip}</p>
                    </div>

                    {/* Checkbox */}
                    <button
                        onClick={handleCheck}
                        className={`w-full p-4 rounded-xl font-bold flex items-center gap-3 transition-all mb-6 ${canProceed
                            ? 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400'
                            : 'bg-slate-800 border-2 border-slate-700 text-slate-300 hover:border-orange-500 hover:text-orange-400'
                            }`}
                    >
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${canProceed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'
                            }`}>
                            {canProceed && <Check size={14} className="text-white" />}
                        </div>
                        {step.checkText}
                    </button>

                    {/* Navigation */}
                    <div className="flex gap-4">
                        {currentStep > 0 && (
                            <button
                                onClick={handlePrev}
                                className="flex-1 py-4 rounded-xl font-bold border border-slate-600 text-slate-400 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={18} /> Vorige
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={!canProceed}
                            className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${canProceed
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:shadow-orange-500/30'
                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            {isLastStep ? (
                                <>Afronden <CheckCircle size={18} /></>
                            ) : (
                                <>Volgende <ArrowRight size={18} /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintInstructiesMission;
