import { useEffect, useRef, useState } from 'react';

export default function useScrollDirection(options = {}) {
  const { initial = 'down', threshold = 0 } = options; // threshold in px
  const [dir, setDir] = useState(initial);             // 'up' | 'down'
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR guard

    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      if (ticking.current) return;

      ticking.current = true;
      window.requestAnimationFrame(() => {
        if (Math.abs(y - lastY.current) > threshold) {
          setDir(y < lastY.current ? 'up' : 'down');
          lastY.current = y;
        }
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return dir;
}
