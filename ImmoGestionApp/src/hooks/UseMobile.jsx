import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Hook personnalisé pour détecter si l'écran est mobile
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    );

    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    mql.addEventListener("change", onChange);

    // Initialisation
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Toujours retourner un booléen
  return !!isMobile;
}
