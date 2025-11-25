/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

export const useMediaQuery = (minWidth, maxWidth = null) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Construir query dinámicamente
    let query;
    
    if (maxWidth) {
      // Rango: min-width y max-width
      query = `(min-width: ${minWidth}px) and (max-width: ${maxWidth}px)`;
    } else if (typeof minWidth === 'string') {
      // Query personalizada (ej: "(min-width: 768px)")
      query = minWidth;
    } else {
      // Solo min-width
      query = `(min-width: ${minWidth}px)`;
    }

    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);

    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [matches, minWidth, maxWidth]);

  return matches;
};