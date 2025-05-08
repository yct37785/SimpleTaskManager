import { useMemo } from 'react';
// MUI
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Divider } from '@mui/material';
// schemas
import { Sprint, Project } from '@schemas';
// Gantt chart utils
import { GanttTask, getSprintOperations } from './GanttChartLogic';
// utils
import { getDaysBetween } from '@utils/datetime';

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  project: Project;
  ganttTasks: GanttTask[];
};

/********************************************************************************************************************
 * confirmation dialog
 ********************************************************************************************************************/
export default function GanttChartConfirmDialog({ open, onClose, onConfirm, project, ganttTasks }: Props) {
  const { created, modified } = useMemo(() => {
    return open ? getSprintOperations(project, ganttTasks) : { created: [], modified: [] };
  }, [open, project, ganttTasks]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Confirm Sprint Changes</DialogTitle>
      {open ? <DialogContent dividers>
        {created.length > 0 && (
          <>
            <Typography variant='subtitle1' gutterBottom>🆕 New Sprints:</Typography>
            {created.map(s => {
              const duration = getDaysBetween(s.startDate, s.dueDate);
              return (
                <Typography variant='body2' key={s.id}>
                  <strong>{s.title}</strong> ({s.startDate.toString()} → {s.dueDate.toString()}, {duration} days)
                </Typography>
              );
            })}
            <Divider sx={{ my: 2 }} />
          </>
        )}
        {modified.length > 0 && (
          <>
            <Typography variant='subtitle1' gutterBottom>✏️ Modified Sprints:</Typography>
            {modified.map(({ before, after }) => {
              const beforeDur = getDaysBetween(before.startDate, before.dueDate);
              const afterDur = getDaysBetween(after.startDate, after.dueDate);
              return (
                <Typography variant='body2' key={before.id}>
                  <strong>{before.title}</strong><br />
                  {before.startDate.toString()} → {before.dueDate.toString()} ({beforeDur}d) →
                  <br />
                  {after.startDate.toString()} → {after.dueDate.toString()} ({afterDur}d)
                </Typography>
              );
            })}
          </>
        )}
        {created.length === 0 && modified.length === 0 && (
          <Typography variant='body2'>No changes detected.</Typography>
        )}
      </DialogContent> : null}
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color='primary' variant='contained'>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
