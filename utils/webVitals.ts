/**
 * Web Vitals runtime measurement utility.
 *
 * Measures LCP, CLS, INP, FCP, TTFB and logs to console:
 * - Development: always logs
 * - Production: only logs when localStorage flag '__dgskills_vitals=1' is set
 *
 * Enable in production: localStorage.setItem('__dgskills_vitals', '1'); then reload
 * Disable: localStorage.removeItem('__dgskills_vitals'); then reload
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';
import type { Metric } from 'web-vitals';
import { trackEvent } from '../services/analyticsService';

const VITALS_FLAG = '__dgskills_vitals';

function shouldLog(): boolean {
  const isDev = typeof import.meta !== 'undefined' && (import.meta as { env?: { DEV?: boolean } }).env?.DEV === true;
  if (isDev) return true;
  try {
    return localStorage.getItem(VITALS_FLAG) === '1';
  } catch {
    return false;
  }
}

function logMetric(metric: Metric): void {
  const value = metric.name === 'CLS' ? metric.value.toFixed(3) : Math.round(metric.value);
  
  if (shouldLog()) {
    console.log(`[Web Vitals] ${metric.name}: ${value} (${metric.rating})`);
  }

  // Altijd naar analytics sturen in productie
  trackEvent('web_vital', {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    id: metric.id
  });
}

export function initWebVitals(): void {
  onCLS(logMetric);
  onFCP(logMetric);
  onINP(logMetric);
  onLCP(logMetric);
  onTTFB(logMetric);
}
