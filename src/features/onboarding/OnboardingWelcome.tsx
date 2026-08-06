import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Compass, ArrowRight } from 'lucide-react';
import { useTutorial } from '@/contexts/TutorialContext';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { TutorialVideoModal } from './TutorialVideoModal';
import { videoVoorRol, type TutorialVideoRol } from './tutorialVideos';

interface Props {
    rol: TutorialVideoRol;
    /** Is het dashboard klaar en zijn alle blokkerende schermen voorbij? */
    ready: boolean;
}

/**
 * De keuze bij de eerste keer inloggen: kijken, klikken of overslaan.
 *
 * Bewust een keuze en geen verplichte film. Een leerling van dertien die twee
 * minuten moet wachten voor hij bij zijn eerste opdracht mag, haakt af — en een
 * docent die tussen twee lessen inlogt net zo goed.
 */
export const OnboardingWelcome: React.FC<Props> = ({ rol, ready }) => {
    const { startTutorial, skipTutorial, hasCompleted, isActive } = useTutorial();
    const beperkteBeweging = usePrefersReducedMotion();
    const [videoOpen, setVideoOpen] = useState(false);
    const video = videoVoorRol(rol);

    // Niet tonen aan wie dit al gehad heeft, en niet bovenop een lopende rondleiding.
    const open = ready && !hasCompleted && !isActive && video !== null;

    const minuten = video ? Math.max(1, Math.round(video.durationSeconden / 60)) : 0;

    const tekst = rol === 'student'
        ? { kop: 'Welkom bij DGSkills', uitleg: 'Wil je eerst even zien hoe het werkt?' }
        : { kop: 'Welkom bij je dashboard', uitleg: 'Een korte introductie, of meteen aan de slag?' };

    /* Zie TutorialVideoModal: geen AnimatePresence-exit, want een uitgaand kind
     * blijft hier op `opacity: 0` in de DOM hangen en dat ziet een schermlezer. */
    return (
        <>
            {open && !videoOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: beperkteBeweging ? 0 : 0.2 }}
                        className="fixed inset-0 z-[140] flex items-center justify-center bg-duck-ink/60 p-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={beperkteBeweging ? { opacity: 1 } : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: beperkteBeweging ? 0 : 0.25 }}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="welkom-kop"
                            className="w-full max-w-md rounded-[1.5rem] bg-duck-bgLight p-6 shadow-2xl"
                        >
                            <div className="mb-4 flex items-center gap-3">
                                <img
                                    src="/assets/brand/dgskills-duck-guide-v3.png"
                                    alt=""
                                    aria-hidden="true"
                                    className="size-12 object-contain"
                                />
                                <div>
                                    <h2 id="welkom-kop" className="text-lg font-extrabold text-duck-ink">{tekst.kop}</h2>
                                    <p className="text-sm font-semibold text-duck-ink/70">{tekst.uitleg}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                {video && (
                                    <button
                                        type="button"
                                        onClick={() => setVideoOpen(true)}
                                        className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-duck-ink bg-duck-acid px-4 text-left text-sm font-extrabold text-duck-ink transition hover:-translate-y-0.5 motion-reduce:transition-none"
                                    >
                                        <PlayCircle size={20} />
                                        <span className="flex-1">Bekijk de video</span>
                                        <span className="text-xs font-bold text-duck-ink/70">{minuten} min</span>
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={startTutorial}
                                    className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-duck-ink/15 bg-white px-4 text-left text-sm font-extrabold text-duck-ink transition hover:-translate-y-0.5 motion-reduce:transition-none"
                                >
                                    <Compass size={20} />
                                    <span className="flex-1">Laat het me zien op het scherm</span>
                                    <ArrowRight size={16} className="text-duck-ink/60" />
                                </button>

                                <button
                                    type="button"
                                    onClick={skipTutorial}
                                    className="min-h-[44px] rounded-2xl px-4 text-sm font-bold text-duck-ink/70 transition hover:bg-duck-bg hover:text-duck-ink"
                                >
                                    Overslaan, ik zoek het zelf uit
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
            )}

            {video && (
                <TutorialVideoModal
                    video={video}
                    open={videoOpen}
                    // Na de video is de introductie gehad; de rondleiding blijft
                    // bereikbaar via de vraagteken-knop.
                    onClose={() => { setVideoOpen(false); skipTutorial(); }}
                />
            )}
        </>
    );
};
