'use client';

import { useEffect, useRef } from 'react';
import Gantt from 'frappe-gantt';
import { Project } from '@defines/schemas';

type Props = {
  project: Project;
};

// hardcoded sprints demo
const fakeSprints = [
  {
    id: '1',
    name: 'Redesign Website',
    start: '2024-04-01',
    end: '2024-04-07',
    progress: 25,
  },
  {
    id: '2',
    name: 'Build Sprint View',
    start: '2024-04-08',
    end: '2024-04-14',
    progress: 50,
  },
  {
    id: '3',
    name: 'Launch Marketing',
    start: '2024-04-15',
    end: '2024-04-22',
    progress: 80,
  },
];

export default function SprintList({ project }: Props) {
  const ganttRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ganttRef.current;
    if (!container) return;

    // clear previous chart before creating new one
    container.innerHTML = '';

    new Gantt(container, fakeSprints, {
      view_mode: 'Day',
      custom_popup_html: (task: any) => `
        <div style="
          padding: 8px;
          max-width: 250px;
          background: white;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        ">
          <div style="font-weight: 600; margin-bottom: 4px;">${task.name}</div>
          <div style="margin-bottom: 4px;">${task.progress}% complete</div>
          <div style="font-size: 0.875rem; color: gray;">
            ${task._start.toDateString()} → ${task._end.toDateString()}
          </div>
        </div>
      `,
    });
  }, [project]);

  return (
    <div style={{ flex: 1 }}>
      <h3 style={{ marginBottom: '1rem' }}>Sprint Timeline</h3>

      <div
        ref={ganttRef}
        style={{
          flex: 1,
          border: '1px solid #ddd',
          borderRadius: 8,
        }}
      />
    </div>
  );
}
