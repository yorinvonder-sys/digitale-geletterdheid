const SENSITIVE_QUERY_KEYS = /token|key|secret|password|authorization/i;

export function redactText(value) {
  let text = String(value ?? '')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[REDACTED_EMAIL]')
    .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[REDACTED_TOKEN]')
    .replace(/(password|secret|api[_-]?key|access[_-]?token|refresh[_-]?token)\s*[:=]\s*[^\s&]+/gi, '$1=[REDACTED]');

  text = text.replace(/https?:\/\/[^\s]+/g, (candidate) => {
    try {
      const url = new URL(candidate);
      for (const key of url.searchParams.keys()) {
        if (SENSITIVE_QUERY_KEYS.test(key)) url.searchParams.set(key, '[REDACTED]');
      }
      return url.toString();
    } catch {
      return candidate;
    }
  });
  return text;
}

export function addDomTelemetry(telemetry, snapshot) {
  const links = new Set(telemetry.externalLinks || []);
  for (const link of snapshot.externalLinks || []) links.add(redactText(link));
  telemetry.externalLinks = [...links];

  const media = new Map((telemetry.mediaErrors || []).map((entry) => [`${entry.type}:${entry.url}`, entry]));
  for (const entry of snapshot.mediaErrors || []) {
    const redacted = { type: entry.type, url: redactText(entry.url) };
    media.set(`${redacted.type}:${redacted.url}`, redacted);
  }
  telemetry.mediaErrors = [...media.values()];
  return telemetry;
}

export function attachTelemetry(page) {
  const telemetry = {
    consoleErrors: [],
    pageErrors: [],
    failedRequests: [],
    httpErrors: [],
    externalLinks: [],
    mediaErrors: [],
  };

  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const location = message.location?.() || {};
    telemetry.consoleErrors.push({
      text: redactText(message.text()),
      url: redactText(location.url || ''),
      lineNumber: location.lineNumber ?? null,
    });
  });
  page.on('pageerror', (error) => {
    telemetry.pageErrors.push({ message: redactText(error?.message || error) });
  });
  page.on('requestfailed', (request) => {
    telemetry.failedRequests.push({
      method: request.method(),
      url: redactText(request.url()),
      error: redactText(request.failure?.()?.errorText || 'request failed'),
    });
  });
  page.on('response', (response) => {
    const status = response.status();
    if (status < 400) return;
    telemetry.httpErrors.push({
      status,
      method: response.request().method(),
      resourceType: response.request().resourceType?.() || 'unknown',
      url: redactText(response.url()),
    });
  });
  return telemetry;
}
