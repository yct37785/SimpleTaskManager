/**
 * disables horizontal scrolling via mouse wheel on a given element
 * - still allows scrollbar dragging and vertical scroll
 */
export function disableHorizontalWheelScroll(container: HTMLElement | null) {
  const onWheel = (event: WheelEvent) => {
    if (event.deltaX !== 0) {
      event.preventDefault();
    }
  };

  container?.addEventListener('wheel', onWheel, { passive: false });

  return () => {
    container?.removeEventListener('wheel', onWheel);
  };
}
