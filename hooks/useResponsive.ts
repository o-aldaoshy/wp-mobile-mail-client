
import { useState, useEffect } from 'react';

type LayoutType = 'one-pane' | 'two-pane' | 'three-pane';

export const useResponsiveLayout = () => {
  const [layout, setLayout] = useState<LayoutType>('one-pane');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 840) {
        setLayout('three-pane');
      } else if (window.innerWidth >= 600) {
        setLayout('two-pane');
      } else {
        setLayout('one-pane');
      }
    };

    handleResize(); // Set initial layout
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { layout };
};
