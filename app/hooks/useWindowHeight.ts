import { useEffect, useState } from 'react';

export function useWindowHeight(): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => setHeight(window.innerHeight);
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return height;
}