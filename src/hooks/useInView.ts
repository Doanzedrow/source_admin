import { useState, useEffect, useRef } from 'react';

export interface UseInViewOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}


export const useInView = <T extends HTMLElement = HTMLDivElement>({ 
  triggerOnce = true, 
  root = null,
  rootMargin = '0px',
  threshold = 0,
}: UseInViewOptions = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (triggerOnce) {
          observer.unobserve(el);
        }
      } else if (!triggerOnce) {
        setIsInView(false);
      }
    }, { root, rootMargin, threshold });

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [root, rootMargin, threshold, triggerOnce]);

  return { ref, isInView };
};
