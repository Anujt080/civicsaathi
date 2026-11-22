import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const scroll = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
        return false;
      };

      if (!scroll()) {
        const timer1 = setTimeout(scroll, 100);
        const timer2 = setTimeout(scroll, 300);
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
      return undefined;
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return undefined;
    }
  }, [pathname, hash]);

  return null;
};
