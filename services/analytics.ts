// ============================================================
// Lightweight analytics tracking hooks.
//
// Emits events to Google Analytics (gtag.js) when present, and always logs
// to console in development so events are verifiable without a GA property.
// To go live: add the GA4 measurement script (see index.html placeholder)
// and, for Search Console, verify domain ownership via the meta tag or
// DNS record — no code changes required beyond adding those tags.
// ============================================================

export type AnalyticsEvent =
  | 'call_click'
  | 'text_click'
  | 'whatsapp_click'
  | 'estimate_started'
  | 'estimate_step_completed'
  | 'estimate_completed'
  | 'project_view'
  | 'video_play'
  | 'before_after_interaction'
  | 'service_view'
  | 'language_changed';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function trackEvent(event: AnalyticsEvent, params: Record<string, any> = {}): void {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', event, params);
    } else if ((import.meta as any).env?.DEV) {
      // eslint-disable-next-line no-console
      console.debug(`[analytics] ${event}`, params);
    }
  } catch {
    // Analytics must never break the app.
  }
}
