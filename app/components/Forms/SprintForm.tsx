'use client';

import React, { useEffect, useState } from 'react';
// MUI
import { Stack, TextField, Box } from '@mui/material';
// date
import { CalendarDate } from '@internationalized/date';
// our components
import BaseDialog, { DialogTextInput } from '@UI/Dialog/Dialog';
import Popover from '@UI/Dialog/Popover';
import RangeCalendar from '@UI/Calendar/RangeCalendar';
// schemas
import { Project } from '@schemas';
// styles
import { calendar_picker_height } from '@styles/dimens';

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
type Props = {
  project: Project;
  sprintDialogOpen: boolean;
  handleCreateSprint: (title: string, desc: string, startDate: CalendarDate, dueDate: CalendarDate) => void;
  closeSprintDialog: () => void;
};

/********************************************************************************************************************
 * project creation form
 ********************************************************************************************************************/
export default function ProjectForm({ project, sprintDialogOpen, handleCreateSprint, closeSprintDialog }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<CalendarDate | null>(null);
  const [dueDate, setDueDate] = useState<CalendarDate | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  /******************************************************************************************************************
   * do reset when close
   ******************************************************************************************************************/
  useEffect(() => {
    if (!sprintDialogOpen) {
      setTitle('');
      setDescription('');
      setStartDate(null);
      setDueDate(null);
    }
  }, [sprintDialogOpen]);

  /******************************************************************************************************************
   * submit
   ******************************************************************************************************************/
  const onDateSelected = (start: CalendarDate, end: CalendarDate) => {
    setStartDate(start);
    setDueDate(end);
    setAnchorEl(null);
  }

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !startDate || !dueDate) return;

    handleCreateSprint(title, description, startDate, dueDate);
    closeSprintDialog();
  }

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <>
      {/* calendar popover */}
      <Popover
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      >
        <Box sx={{ height: calendar_picker_height }}>
          <RangeCalendar
            onSelect={onDateSelected}
          />
        </Box>
      </Popover>

      {/* main form */}
      <BaseDialog
        open={sprintDialogOpen}
        onClose={closeSprintDialog}
        onSubmit={handleSubmit}
        title={`${project.title} - New Sprint`}
        disabled={!title || !description || !dueDate}
      >
        <Stack spacing={2}>
          <DialogTextInput
            label='Sprint Title'
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <DialogTextInput
            label='Sprint Description'
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label='Start-End Dates'
            fullWidth
            required
            value={dueDate ? `${dueDate.day.toString().padStart(2, '0')}/${dueDate.month.toString().padStart(2, '0')}/${dueDate.year}` : '--/--/----'}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            sx={{
              cursor: 'pointer',
              input: {
                cursor: 'pointer',
              },
            }}
          />
        </Stack>
      </BaseDialog>
    </>
  );
}
