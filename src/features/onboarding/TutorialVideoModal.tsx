import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

import type { TutorialVideo } from './tutorialVideos';

interface Props {
    video: TutorialVideo;
    open: boolean;
    onClose: () => void;
}

/**
 * Speelt de instructievideo af.
 *
 * Volgt het huisrecept voor modals in deze codebase — eigen backdrop, eigen
 * Escape-listener, framer-motion — want er is geen gedeelde dialoogbibliotheek
 * en er is er ook geen nodig.
 *
 * `preload="none"` is bewust: het bestand wordt pas opgehaald als iemand op
 * afspelen drukt. Bij een paar honderd leerlingen scheelt dat de hele bandbreedte
 * van mensen die de video overslaan.
 */
export const TutorialVideoModal: React.FC<Props> = ({ video, open, onClose }) => {
    const kaartRef = useRef<HTMLDivElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const beperkteBeweging = usePrefersReducedMotion();

    useFocusTrap(kaartRef, open);

    useEffect(() => {
        if (!open) return;
        const opToets = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', opToets);
        return () => document.removeEventListener('keydown', opToets);
    }, [open, onClose]);

    // Sluiten stopt het geluid; anders praat de video door achter een dicht scherm.
    useEffect(() => {
        if (!open) videoRef.current?.pause();
    }, [open]);

    /*
     * Bewust géén AnimatePresence met exit-animatie. In deze framer-motion-versie
     * blijft een uitgaand kind op `opacity: 0` in de DOM staan in plaats van te
     * verdwijnen — onzichtbaar, maar een schermlezer ziet de dialoog dan nog
     * steeds staan. Simpelweg niets renderen is hier belangrijker dan de
     * uitloop-animatie.
     */
    if (!open) return null;

    return (
        <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: beperkteBeweging ? 0 : 0.2 }}
                    className="fixed inset-0 z-[150] flex items-center justify-center bg-duck-ink/70 p-4 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        ref={kaartRef}
                        initial={beperkteBeweging ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: beperkteBeweging ? 0 : 0.2 }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="video-titel"
                        className="w-full max-w-3xl overflow-hidden rounded-[1.5rem] bg-duck-bgLight shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between gap-4 border-b border-duck-ink/10 px-5 py-3">
                            <h2 id="video-titel" className="text-base font-extrabold text-duck-ink">
                                {video.titel}
                            </h2>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Video sluiten"
                                className="flex size-9 items-center justify-center rounded-full text-duck-ink/70 transition hover:bg-duck-bg hover:text-duck-ink"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <video
                            ref={videoRef}
                            controls
                            preload="none"
                            poster={video.poster}
                            className="block w-full bg-duck-ink"
                            onEnded={onClose}
                        >
                            <source src={video.bestand} type="video/mp4" />
                            <track kind="captions" srcLang="nl" label="Nederlands" src={video.ondertitels} default />
                            Je browser kan deze video niet afspelen.
                        </video>

                        <div className="px-5 py-3">
                            <p className="text-xs font-semibold text-duck-ink/70">
                                Ondertiteling staat aan. Je kunt de video op elk moment sluiten en later terugkijken
                                via de vraagteken-knop rechtsonder.
                            </p>
                        </div>
                    </motion.div>
        </motion.div>
    );
};
