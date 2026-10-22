const storageKey = 'booxboo_analytics_excluded';
const measurementId = (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_GA_MEASUREMENT_ID || '';
const productionHosts = new Set(['booxboo.me', 'www.booxboo.me']);

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;
let lastPath: string | null = null;

export function isAnalyticsExcluded() {
  try {
    if (localStorage.getItem(storageKey) === 'true') return true;
  } catch { /* Cookies can still retain the preference when storage is blocked. */ }
  return document.cookie.split(';').some(cookie => cookie.trim() === `${storageKey}=true`);
}

export function setAnalyticsExcluded(excluded: boolean) {
  try { localStorage.setItem(storageKey, String(excluded)); } catch { /* Try cookie storage below. */ }
  const domain = productionHosts.has(location.hostname) ? '; Domain=booxboo.me' : '';
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${storageKey}=${excluded}; Path=/; Max-Age=31536000; SameSite=Lax${domain}${secure}`;
  (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = excluded;
  return isAnalyticsExcluded() === excluded;
}

function canTrack() {
  return productionHosts.has(location.hostname)
    && /^G-[A-Z0-9]+$/.test(measurementId)
    && !location.pathname.startsWith('/analytics-settings')
    && !isAnalyticsExcluded();
}

window.addEventListener('storage', event => {
  if (event.key === storageKey) {
    (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = isAnalyticsExcluded();
  }
});

function initialize() {
  const allowed = canTrack();
  (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = !allowed;
  if (!allowed) return false;
  if (initialized) return true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer!.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
  initialized = true;
  return true;
}

export function trackEvent(name: string, parameters: Record<string, string | number> = {}) {
  if (!initialize()) return;
  window.gtag!('event', name, parameters);
}

export function trackPage(path: string, title: string, project?: { id: number; title: string }) {
  if (!initialize() || path === lastPath) return;
  const previousPath = lastPath;
  lastPath = path;
  const parameters = {
    page_location: `${location.origin}${path}`,
    page_title: title,
    ...(previousPath ? { page_referrer: `${location.origin}${previousPath}` } : {}),
  };
  trackEvent('page_view', parameters);
  if (project) {
    trackEvent('project_view', { ...parameters, project_id: String(project.id), project_name: project.title });
  }
}

// Count actual foreground time, not time spent with the tab hidden or unfocused.
export function watchProjectInterest(project: { id: number; title: string }) {
  let elapsed = 0;
  let lastTick = performance.now();
  let active = document.visibilityState === 'visible' && document.hasFocus();
  let sent = false;
  function tick() {
    const now = performance.now();
    if (active) elapsed += Math.min(now - lastTick, 2000);
    lastTick = now;
    active = document.visibilityState === 'visible' && document.hasFocus();
    if (!sent && elapsed >= 30000) {
      sent = true;
      trackEvent('project_interest', { project_id: String(project.id), project_name: project.title, active_seconds: 30 });
    }
  }
  const timer = window.setInterval(tick, 1000);
  document.addEventListener('visibilitychange', tick);
  window.addEventListener('focus', tick);
  window.addEventListener('blur', tick);
  return () => {
    window.clearInterval(timer);
    document.removeEventListener('visibilitychange', tick);
    window.removeEventListener('focus', tick);
    window.removeEventListener('blur', tick);
  };
}
