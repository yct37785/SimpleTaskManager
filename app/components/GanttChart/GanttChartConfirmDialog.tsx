import { useMemo, useState } from 'react';
// MUI
import { Typography, Divider } from '@mui/material';
// utils
import { getDaysBetween, formatISOToCalendarDate } from '@utils/datetime';
// comps
import BaseDialog from '@UI/Dialog/Dialog';
// Gantt chart utils
import { GanttTask } from './GanttChartLogic';
// schemas
import { Project } from '@schemas';

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  project: Project;
  draftTasks: Record<string, GanttTask>;
};

/********************************************************************************************************************
 * confirmation dialog
 ********************************************************************************************************************/
export default function GanttChartConfirmDialog({ open, onClose, onConfirm, project, draftTasks }: Props) {
  // state
  const [loading, setLoading] = useState(false);

  const created = Object.values(draftTasks).filter(t => t.edit_type === 'new');
  const modified = Object.values(draftTasks).filter(t => t.edit_type === 'modified');

  /******************************************************************************************************************
   * submit
   ******************************************************************************************************************/
  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      onSubmit={handleConfirm}
      title='Confirm Sprint Changes'
      submitLabel='Confirm'
      loading={loading}
    >
      {created.length > 0 && (
        <>
          <Typography variant='subtitle1' gutterBottom>🆕 New Sprints:</Typography>
          {created.map(task => {
            const duration = getDaysBetween(formatISOToCalendarDate(task.start), formatISOToCalendarDate(task.end));
            return (
              <Typography variant='body2' key={task.id}>
                <strong>{task.name}</strong> ({task.start} → {task.end}, {duration} days)
              </Typography>
            );
          })}
          <Divider sx={{ my: 2 }} />
        </>
      )}

      {modified.length > 0 && (
        <>
          <Typography variant='subtitle1' gutterBottom>✏️ Modified Sprints:</Typography>
          {modified.map(task => {
            const original = project.sprints.find(s => s.id === task.id);
            if (!original) return null;

            const beforeDur = getDaysBetween(original.startDate, original.dueDate);
            const afterDur = getDaysBetween(formatISOToCalendarDate(task.start), formatISOToCalendarDate(task.end));

            return (
              <Typography variant='body2' key={task.id}>
                <strong>{original.title}</strong><br />
                {original.startDate.toString()} → {original.dueDate.toString()} ({beforeDur}d) →
                <br />
                {task.start} → {task.end} ({afterDur}d)
              </Typography>
            );
          })}
        </>
      )}

      {created.length === 0 && modified.length === 0 && (
        <Typography variant='body2'>No changes detected.</Typography>
      )}
    </BaseDialog>
  );
}
