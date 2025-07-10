// File: hooks/useIntersectionObserver.ts

import { useState, useEffect, useRef, RefObject } from 'react';

/**
 * Defines the options for the Intersection Observer, adding a custom
 * `triggerOnce` flag to the standard IntersectionObserverInit.
 */
interface ObserverOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

/**
 * A custom React Hook that tracks the visibility of an HTML element in the viewport.
 * @param options - Configuration options for the IntersectionObserver API,
 * plus a custom `triggerOnce` boolean.
 * @returns A tuple containing a RefObject to attach to the element and a boolean
 * indicating if the element is currently visible.
 * @template T - The type of the HTML element to be observed, defaults to HTMLDivElement.
 */
// THIS IS THE DEFINITIVE FIX:
// The function signature now correctly states that the RefObject it returns
// can hold a value of type T OR null.
export const useIntersectionObserver = <T extends HTMLElement = HTMLDivElement>(
  options?: ObserverOptions
): [RefObject<T | null>, boolean] => {
  // The ref is initialized with null, so its type is and will always be RefObject<T | null>.
  const containerRef = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = containerRef.current;
    
    const observerCallback = ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (options?.triggerOnce && currentRef) {
          observer.unobserve(currentRef);
        }
      } else {
        if (!options?.triggerOnce) {
          setIsVisible(false);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, options);

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
    // The dependency array is correct. The issue was purely in the type signature.
  }, [options]);

  return [containerRef, isVisible];
};