'use client';

import React, { useState } from 'react';
// MUI
import { Stack, TextField, Box } from '@mui/material';
// our components
import BaseDialog, { DialogTextInput } from '@UI/Dialog/Dialog';
import Popover from '@UI/Dialog/Popover';
import CalendarPicker from '@UI/Calendar/CalendarPicker';
// date
import dayjs, { Dayjs } from 'dayjs';
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
  handleCreateProject: (title: string, desc: string, dueDate: Date) => void;
  closeProjectDialog: () => void;
};

/********************************************************************************************************************
 * project creation form
 ********************************************************************************************************************/
export default function ProjectForm({ workspace, projectDialogOpen, handleCreateProject, closeProjectDialog }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Dayjs | null>(dayjs());
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  /******************************************************************************************************************
   * submit
   ******************************************************************************************************************/
  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !dueDate) return;

    handleCreateProject(title, description, dueDate.toDate());
    setTitle('');
    setDescription('');
    setDueDate(dayjs());
    closeProjectDialog();
  };

  const handleDateSelected = (date: Dayjs) => {
    setDueDate(date);
    setAnchorEl(null);
  };

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
          <CalendarPicker />
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
            label='Project title'
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <DialogTextInput
            label='Project description'
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Deadline"
            fullWidth
            required
            value={dueDate ? dueDate.format('DD/MM/YYYY') : ''}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            InputProps={{
              readOnly: true,
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
