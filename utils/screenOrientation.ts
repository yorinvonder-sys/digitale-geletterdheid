/**
 * Screen Orientation Utility
 * Provides functions to lock/unlock screen orientation for optimal mission experience.
 * Note: Screen Orientation API requires fullscreen on iOS Safari.
 */

type OrientationType = 'landscape' | 'portrait' | 'landscape-primary' | 'landscape-secondary' | 'portrait-primary' | 'portrait-secondary';

// Vendor-prefixed fullscreen and orientation APIs not covered by standard TypeScript DOM lib.
interface FullscreenElement extends HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
}

interface FullscreenDocument extends Document {
    webkitExitFullscreen?: () => void;
    mozCancelFullScreen?: () => void;
    msExitFullscreen?: () => void;
}

interface OrientationScreen extends Screen {
    orientation: ScreenOrientation & { lock?: (orientation: string) => Promise<void>; unlock?: () => void };
    lockOrientation?: (orientation: string) => boolean;
    mozLockOrientation?: (orientation: string) => boolean;
    msLockOrientation?: (orientation: string) => boolean;
    unlockOrientation?: () => void;
    mozUnlockOrientation?: () => void;
    msUnlockOrientation?: () => void;
}

/**
 * Check if we're on a tablet/iPad
 */
export function isTablet(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIPad = /ipad/.test(userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroidTablet = /android/.test(userAgent) && !/mobile/.test(userAgent);
    const isLargeScreen = window.innerWidth >= 768 && window.innerWidth <= 1366;

    return isIPad || isAndroidTablet || (isLargeScreen && 'ontouchstart' in window);
}

/**
 * Check if screen is currently in portrait mode
 */
export function isPortrait(): boolean {
    return window.innerHeight > window.innerWidth;
}

/**
 * Request fullscreen mode (required for orientation lock on some browsers)
 */
export async function requestFullscreen(element?: HTMLElement): Promise<boolean> {
    const el = (element || document.documentElement) as FullscreenElement;

    try {
        if (el.requestFullscreen) {
            await el.requestFullscreen();
            return true;
        } else if (el.webkitRequestFullscreen) {
            await el.webkitRequestFullscreen();
            return true;
        } else if (el.mozRequestFullScreen) {
            await el.mozRequestFullScreen();
            return true;
        } else if (el.msRequestFullscreen) {
            await el.msRequestFullscreen();
            return true;
        }
    } catch (error) {
        console.warn('Fullscreen request failed:', error);
    }
    return false;
}

/**
 * Exit fullscreen mode
 */
export async function exitFullscreen(): Promise<void> {
    const doc = document as FullscreenDocument;
    try {
        if (doc.exitFullscreen) {
            await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
            doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
            doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
            doc.msExitFullscreen();
        }
    } catch (error) {
        console.warn('Exit fullscreen failed:', error);
    }
}

/**
 * Lock screen orientation to landscape
 * Returns true if lock was successful
 */
export async function lockToLandscape(): Promise<boolean> {
    try {
        const screen = window.screen as OrientationScreen;

        // Try the standard Screen Orientation API
        if (screen.orientation?.lock) {
            await screen.orientation.lock('landscape');
            console.log('Screen locked to landscape');
            return true;
        }

        // Try vendor-prefixed versions
        if (screen.lockOrientation) {
            return screen.lockOrientation('landscape');
        }
        if (screen.mozLockOrientation) {
            return screen.mozLockOrientation('landscape');
        }
        if (screen.msLockOrientation) {
            return screen.msLockOrientation('landscape');
        }
    } catch (error) {
        console.warn('Orientation lock failed:', error);
    }
    return false;
}

/**
 * Unlock screen orientation
 */
export function unlockOrientation(): void {
    try {
        const screen = window.screen as OrientationScreen;

        if (screen.orientation?.unlock) {
            screen.orientation.unlock();
        } else if (screen.unlockOrientation) {
            screen.unlockOrientation();
        } else if (screen.mozUnlockOrientation) {
            screen.mozUnlockOrientation();
        } else if (screen.msUnlockOrientation) {
            screen.msUnlockOrientation();
        }
    } catch (error) {
        console.warn('Orientation unlock failed:', error);
    }
}

/**
 * Enter mission mode: Try to lock to landscape (with fullscreen if needed)
 * Returns true if landscape mode is active or device is already landscape
 */
export async function enterMissionMode(): Promise<{ success: boolean; needsRotation: boolean }> {
    // If already landscape, no action needed
    if (!isPortrait()) {
        return { success: true, needsRotation: false };
    }

    // If not tablet, don't force orientation
    if (!isTablet()) {
        return { success: true, needsRotation: false };
    }

    // Try to lock orientation
    const locked = await lockToLandscape();

    if (!locked) {
        // If lock failed, we need to show a rotation hint
        return { success: false, needsRotation: true };
    }

    return { success: true, needsRotation: false };
}

/**
 * Exit mission mode: Unlock orientation
 */
export function exitMissionMode(): void {
    unlockOrientation();
}
