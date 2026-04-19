// Cookie consent helpers — almacena preferencias en localStorage
// bajo la key `np_consent_v1`. Versionada por si cambia el shape.

export type ConsentCategory = "necessary" | "analytics" | "marketing";

export type Consent = {
  necessary: true; // siempre activo, no opt-out
  analytics: boolean;
  marketing: boolean;
  // ISO timestamp del último cambio. Usado para auditar expiración / actualización.
  updatedAt: string;
};

export const CONSENT_STORAGE_KEY = "np_consent_v1";

// Evento custom que dispara el provider cuando cambia el consentimiento.
// Componentes como GoogleAnalytics lo escuchan para activarse/desactivarse
// sin esperar a que React propague el context (ej. primera visita tras aceptar).
export const CONSENT_CHANGED_EVENT = "np:consent-changed";

export const DEFAULT_CONSENT: Consent = {
  necessary: true,
  analytics: false,
  marketing: false,
  updatedAt: "",
};

/**
 * Indica si el usuario YA tomó una decisión (aceptó, rechazó o personalizó).
 * Se usa para mostrar/ocultar el banner.
 */
export function hasDecided(consent: Consent): boolean {
  return consent.updatedAt !== "";
}

/**
 * Lee el consentimiento guardado. Devuelve DEFAULT_CONSENT si no existe,
 * está corrupto, o si se ejecuta en SSR (no hay window).
 */
export function getConsent(): Consent {
  if (typeof window === "undefined") return DEFAULT_CONSENT;

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return DEFAULT_CONSENT;

    const parsed = JSON.parse(raw) as Partial<Consent>;

    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return DEFAULT_CONSENT;
  }
}

/**
 * Setea una categoría individual. Necessary siempre queda en true.
 */
export function setConsent(
  category: ConsentCategory,
  value: boolean
): Consent {
  const current = getConsent();
  const next: Consent = {
    ...current,
    [category]: category === "necessary" ? true : value,
    necessary: true,
    updatedAt: new Date().toISOString(),
  };
  persist(next);
  return next;
}

/**
 * Sobreescribe el consentimiento completo. Útil para "Aceptar todo" /
 * "Rechazar todo" / confirmación de modal de personalización.
 */
export function saveConsent(next: Omit<Consent, "updatedAt" | "necessary">): Consent {
  const full: Consent = {
    necessary: true,
    analytics: Boolean(next.analytics),
    marketing: Boolean(next.marketing),
    updatedAt: new Date().toISOString(),
  };
  persist(full);
  return full;
}

/**
 * Shortcut para leer si una categoría está habilitada.
 * Útil en componentes que no quieren consumir el Context entero.
 */
export function hasConsent(category: ConsentCategory): boolean {
  const c = getConsent();
  return Boolean(c[category]);
}

function persist(c: Consent): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(c));
    // Notifica a listeners fuera del árbol de React (ej. scripts externos).
    window.dispatchEvent(new CustomEvent<Consent>(CONSENT_CHANGED_EVENT, { detail: c }));
  } catch {
    // localStorage bloqueado (modo incógnito estricto, cookies OFF, etc.).
    // No romper — el consent del session queda en memoria vía el Provider.
  }
}
