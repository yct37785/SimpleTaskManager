'use client';

import { RefObject } from 'react';
// date
import { CalendarDate } from '@internationalized/date';
// styles
import './frappe-gantt.css';
import './frappe-gantt-custom.css';

/********************************************************************************************************************
 * injects a vertical deadline marker to Gantt chart
 ********************************************************************************************************************/
export function markDeadline(gantt: any, containerEl: HTMLElement | null, deadline: CalendarDate, column_width: number) {
  requestAnimationFrame(() => {
    if (!gantt || !gantt.dates || !containerEl || !deadline) return;

    // find idx offset of the date to add line to
    const index = gantt.dates.findIndex((d: Date) =>
      d.toISOString().split('T')[0] === deadline.toString()
    );
    if (index === -1) return;

    const svgEl = containerEl.querySelector('svg.gantt') as SVGSVGElement | null;
    const svgHeight = svgEl?.getAttribute('height') ?? '372';

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', `${index * column_width}`);
    line.setAttribute('y1', '0');
    line.setAttribute('x2', `${index * column_width}`);
    line.setAttribute('y2', svgHeight);
    line.setAttribute('class', 'gantt-deadline-line');

    gantt.layers.grid.appendChild(line);
  });
}

/********************************************************************************************************************
 * add a highlight to newly added task bar
 ********************************************************************************************************************/
export function highlightLastTaskBar(containerEl: HTMLElement | null) {
  requestAnimationFrame(() => {
    if (!containerEl) return;

    const bars = containerEl.querySelectorAll<SVGRectElement>('.bar .gantt-task-bar');
    if (bars.length === 0) return;

    const lastBar = bars[bars.length - 1];
    if (!lastBar) return;

    lastBar.classList.add('gantt-task-bar-new');

    lastBar.addEventListener(
      'animationend',
      () => {
        lastBar.classList.remove('gantt-task-bar-new');
      },
      { once: true }
    );
  });
}

/********************************************************************************************************************
 * do scroll
 ********************************************************************************************************************/
export function doCustomScroll(
  initialInit: boolean, 
  ganttRef: RefObject<HTMLDivElement | null>,
  prevScrollX: number,
  prevScrollY: number
) {
  if (!ganttRef.current) return;

  const container = ganttRef.current.querySelector('.gantt-container') as HTMLElement | null;
  
  // custom scroll behaviour
  if (!initialInit) {
    if (container) {
      container.scrollTo({
        left: prevScrollX,
        top: prevScrollY,
        behavior: 'instant',
      });
    }
  }
}

/********************************************************************************************************************
 * disables horizontal scrolling via mouse wheel on a given element
 * - still allows scrollbar dragging and vertical scroll
 ********************************************************************************************************************/
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
