export const DEVICE_PROFILES = Object.freeze({
  desktop: Object.freeze({
    id: 'desktop',
    viewport: Object.freeze({ width: 1440, height: 900 }),
    deviceScaleFactor: 1,
    hasTouch: false,
    isMobile: false,
  }),
  'ipad-portrait': Object.freeze({
    id: 'ipad-portrait',
    viewport: Object.freeze({ width: 820, height: 1180 }),
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
  }),
  'ipad-landscape': Object.freeze({
    id: 'ipad-landscape',
    viewport: Object.freeze({ width: 1180, height: 820 }),
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
  }),
  mobile: Object.freeze({
    id: 'mobile',
    viewport: Object.freeze({ width: 390, height: 844 }),
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
  }),
});

export function getDeviceProfile(id) {
  const profile = DEVICE_PROFILES[id];
  if (!profile) {
    throw new Error(`Onbekend deviceprofiel "${id}". Beschikbaar: ${Object.keys(DEVICE_PROFILES).join(', ')}`);
  }
  return profile;
}
