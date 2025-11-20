import { useState, useEffect, useRef } from "react";

/**
 * Hook for animated counter
 * @param {number} targetValue - Final value to count to
 * @param {number} duration - Duration in milliseconds (default 2000)
 * @returns {number} Current count value
 */
export const useCounter = (targetValue, duration = 2000) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStartedRef.current) {
            hasStartedRef.current = true;
            
            // Start counter animation
            const startTime = Date.now();
            const interval = setInterval(() => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const currentValue = Math.floor(progress * targetValue);
              
              setCount(currentValue);
              
              if (progress === 1) {
                clearInterval(interval);
              }
            }, 30);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of element is visible
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [targetValue, duration]);

  return { count, ref: elementRef };
};
