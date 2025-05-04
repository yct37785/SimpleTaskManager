'use client';

import React, { useEffect, useState } from 'react';
// MUI
import { Stack, TextField, Box } from '@mui/material';
// utils
import { CalendarDate } from '@internationalized/date';
// our components
import BaseDialog, { DialogTextInput } from '@UI/Dialog/Dialog';
import Popover from '@UI/Dialog/Popover';
import CalendarPicker from '@UI/Calendar/CalendarPicker';
// schemas
import { Workspace } from '@schemas';
// styles
import { calendar_picker_height } from '@styles/dimens';

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
type Props = {
  workspace: Workspace;
  projectDialogOpen: boolean;
  handleCreateProject: (title: string, desc: string, dueDate: CalendarDate) => void;
  closeProjectDialog: () => void;
};

/********************************************************************************************************************
 * project creation form
 ********************************************************************************************************************/
export default function ProjectForm({ workspace, projectDialogOpen, handleCreateProject, closeProjectDialog }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<CalendarDate | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  /******************************************************************************************************************
   * do reset when close
   ******************************************************************************************************************/
  useEffect(() => {
    if (!projectDialogOpen) {
      setTitle('');
      setDescription('');
      setDueDate(null);
    }
  }, [projectDialogOpen]);

  /******************************************************************************************************************
   * submit
   ******************************************************************************************************************/
  const onDateSelected = (date: CalendarDate) => {
    setDueDate(date);
    setAnchorEl(null);
  }

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !dueDate) return;

    handleCreateProject(title, description, dueDate);
    closeProjectDialog();
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
          <CalendarPicker
            onSelect={onDateSelected}
          />
        </Box>
      </Popover>

      {/* main form */}
      <BaseDialog
        open={projectDialogOpen}
        onClose={closeProjectDialog}
        onSubmit={handleSubmit}
        title={`${workspace.title} - New Project`}
        disabled={!title || !description || !dueDate}
      >
        <Stack spacing={2}>
          <DialogTextInput
            label='Project Title'
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <DialogTextInput
            label='Project Description'
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label='Deadline'
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
