import { getDeviceProfile } from '../config/devices.mjs';

const IPAD_USER_AGENT = 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

export function buildContextOptions(deviceId) {
  const device = getDeviceProfile(deviceId);
  return {
    viewport: device.viewport,
    deviceScaleFactor: device.deviceScaleFactor,
    hasTouch: device.hasTouch,
    isMobile: device.isMobile,
    locale: 'nl-NL',
    timezoneId: 'Europe/Amsterdam',
    colorScheme: 'light',
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
    acceptDownloads: false,
    ...(deviceId.startsWith('ipad-') ? { userAgent: IPAD_USER_AGENT } : {}),
  };
}

export async function createStudentContext(browser, deviceId) {
  return browser.newContext(buildContextOptions(deviceId));
}
