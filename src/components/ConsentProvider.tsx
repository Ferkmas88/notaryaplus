"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CONSENT_CHANGED_EVENT,
  DEFAULT_CONSENT,
  getConsent,
  hasDecided,
  saveConsent,
  type Consent,
  type ConsentCategory,
} from "@/lib/consent";

type ConsentContextValue = {
  consent: Consent;
  hasDecided: boolean;
  hydrated: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  save: (next: { analytics: boolean; marketing: boolean }) => void;
  isEnabled: (category: ConsentCategory) => boolean;
};

const ConsentContext = createContext<ConsentContextValue>({
  consent: DEFAULT_CONSENT,
  hasDecided: false,
  hydrated: false,
  acceptAll: () => {},
  rejectAll: () => {},
  save: () => {},
  isEnabled: () => false,
});

export function useConsent(): ConsentContextValue {
  return useContext(ConsentContext);
}

/**
 * Provider del estado de consentimiento.
 *
 * Nota de hydration: arranca con DEFAULT_CONSENT (todo OFF) para que el
 * primer render del server y del client coincidan. Tras el efecto inicial,
 * lee localStorage y actualiza. Esto significa que los scripts condicionales
 * (GA4, pixels) NUNCA se inyectan en el render inicial — solo después del
 * primer paint, si el usuario ya había aceptado previamente.
 */
export default function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<Consent>(DEFAULT_CONSENT);
  const [hydrated, setHydrated] = useState(false);

  // Hidratar desde localStorage una vez en el cliente.
  useEffect(() => {
    setConsent(getConsent());
    setHydrated(true);
  }, []);

  // Escuchar cambios disparados desde otras pestañas (`storage` event)
  // y cambios programáticos (CustomEvent del mismo tab).
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "np_consent_v1") setConsent(getConsent());
    };
    const onCustom = (e: Event) => {
      const ce = e as CustomEvent<Consent>;
      if (ce.detail) setConsent(ce.detail);
      else setConsent(getConsent());
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(CONSENT_CHANGED_EVENT, onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CONSENT_CHANGED_EVENT, onCustom);
    };
  }, []);

  const acceptAll = useCallback(() => {
    setConsent(saveConsent({ analytics: true, marketing: true }));
  }, []);

  const rejectAll = useCallback(() => {
    setConsent(saveConsent({ analytics: false, marketing: false }));
  }, []);

  const save = useCallback(
    (next: { analytics: boolean; marketing: boolean }) => {
      setConsent(saveConsent(next));
    },
    []
  );

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      hasDecided: hasDecided(consent),
      hydrated,
      acceptAll,
      rejectAll,
      save,
      isEnabled: (category) => Boolean(consent[category]),
    }),
    [consent, hydrated, acceptAll, rejectAll, save]
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}
