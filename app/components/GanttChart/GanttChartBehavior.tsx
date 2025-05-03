'use client';

import { RefObject } from 'react';
// utils
import { CalendarDate } from '@internationalized/date';
import { getDaysBetween, formatISOToDate } from '@utils/datetime';
// Gantt chart utils
import { GanttTask } from './GanttChartLogic';

/********************************************************************************************************************
 * get Gantt chart container element
 ********************************************************************************************************************/
export function getGanttContainerEL(ganttRef: RefObject<HTMLDivElement | null>) {
  return ganttRef.current?.querySelector('.gantt-container') as HTMLElement | null;
}

/********************************************************************************************************************
 * injects a vertical deadline marker to Gantt chart
 ********************************************************************************************************************/
export function markDeadline(ganttInstance: RefObject<any>, ganttRef: RefObject<HTMLDivElement | null>, deadline: CalendarDate, column_width: number) {
  requestAnimationFrame(() => {
    if (!ganttInstance.current || !ganttInstance.current.dates || !ganttRef.current) return;

    // find idx offset of the date to add line to
    const index = ganttInstance.current.dates.findIndex((d: Date) =>
      d.toISOString().split('T')[0] === deadline.toString()
    );
    if (index === -1) return;

    const svgEl = ganttRef.current.querySelector('svg.gantt') as SVGSVGElement | null;
    const svgHeight = svgEl?.getAttribute('height') ?? '372';

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', `${index * column_width}`);
    line.setAttribute('y1', '0');
    line.setAttribute('x2', `${index * column_width}`);
    line.setAttribute('y2', svgHeight);
    line.setAttribute('class', 'gantt-deadline-line');

    ganttInstance.current.layers.grid.appendChild(line);
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
  ganttInstance: RefObject<any>,
  ganttRef: RefObject<HTMLDivElement | null>,
  prevScrollX: number,
  prevScrollY: number,
  highlightLastTask: boolean,
  ganttTasks: GanttTask[],
  column_width: number
) {
  requestAnimationFrame(() => {
    if (!ganttRef.current) return;

    const container = getGanttContainerEL(ganttRef);
    if (!container) return;

    // scroll to curr
    container.scrollLeft = prevScrollX;
    container.scrollTop = prevScrollY;

    // scroll to target
    if (highlightLastTask) {
      if (ganttInstance.current.dates && ganttInstance.current.dates.length > 0 && ganttTasks.length > 0) {
        const daysBtw = getDaysBetween(ganttInstance.current.dates[0], formatISOToDate(ganttTasks[ganttTasks.length - 1].start));
        requestAnimationFrame(() => {
          container.scrollTo({
            left: daysBtw * column_width,
            top: container.scrollHeight,
            behavior: 'smooth',
          });
        });
        // do highlight on last task
        highlightLastTaskBar(container);
      }
    }
  });
}

/********************************************************************************************************************
 * custom drag to scroll behaviour
 * - drag and scroll horizontally
 * - disables horizontal scrolling via mouse wheel on a given element
 ********************************************************************************************************************/
export function enableGanttDragScroll(container: HTMLElement | null): () => void {
  if (!container) return () => {};

  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

  const onMouseDown = (e: MouseEvent) => {
    // only allow drag scroll on background (not bars or handles)
    const target = e.target as HTMLElement;
    if (target.closest('.bar-group') || target.closest('.handle') || target.closest('.bar-progress')) return;

    isDragging = true;
    startX = e.clientX;
    scrollLeft = container.scrollLeft;
    container.classList.add('dragging');

    // prevent text selection while dragging
    document.body.style.userSelect = 'none';
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const walk = e.clientX - startX;
    container.scrollLeft = scrollLeft - walk;
  };

  const onMouseUp = () => {
    if (!isDragging) return;
    isDragging = false;
    container.classList.remove('dragging');
    document.body.style.userSelect = ''; // restore text selection
  };

  const onWheel = (event: WheelEvent) => {
    if (event.deltaX !== 0) event.preventDefault();
  };

  // attach drag tracking globally
  container.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  container.addEventListener('wheel', onWheel, { passive: false });

  return () => {
    container.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    container.removeEventListener('wheel', onWheel);
  };
}
