
import { useState, useEffect, useRef, RefObject } from 'react';

export const useIntersectionObserver = <T extends HTMLElement,>(
  options?: IntersectionObserverInit
): [RefObject<T | null>, boolean] => {
  const containerRef = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Disconnect after it becomes visible to avoid re-triggering
        if (containerRef.current) {
          observer.unobserve(containerRef.current);
        }
      }
    }, options);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(containerRef.current);
      }
    };
  }, [containerRef, options]);

  return [containerRef, isVisible];
};
