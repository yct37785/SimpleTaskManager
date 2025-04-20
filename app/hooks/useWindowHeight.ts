import { useEffect, useState } from 'react';

/********************************************************************************************************************
 * retrieve dynamic height of window
 ********************************************************************************************************************/
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