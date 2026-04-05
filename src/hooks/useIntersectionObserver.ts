import { useEffect, useRef } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver({
  threshold = 0.1,
  root = null,
  rootMargin = '0px',
  triggerOnce = true,
}: UseIntersectionObserverOptions = {}) {
  const targetRef = useRef<Element | null>(null);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        
        // Add visible class when element is intersecting
        if (isElementIntersecting) {
          element.classList.add('is-visible');
        } else if (!triggerOnce) {
          element.classList.remove('is-visible');
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, root, rootMargin, triggerOnce]);

  const setRef = (element: Element | null) => {
    targetRef.current = element;
  };

  return { ref: setRef };
}

// Hook for multiple elements
export function useIntersectionObserverMultiple({
  threshold = 0.1,
  root = null,
  rootMargin = '0px',
  triggerOnce = true,
}: UseIntersectionObserverOptions = {}) {
  const elementsRef = useRef<Map<string, Element>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target;
          
          // Add visible class when element is intersecting
          if (entry.isIntersecting) {
            element.classList.add('is-visible');
          } else if (!triggerOnce) {
            element.classList.remove('is-visible');
          }
        });
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    // Observe all elements
    elementsRef.current.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      elementsRef.current.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [threshold, root, rootMargin, triggerOnce]);

  const setRef = (id: string) => (element: Element | null) => {
    if (element) {
      elementsRef.current.set(id, element);
    } else {
      elementsRef.current.delete(id);
    }
  };

  return { setRef };
}
