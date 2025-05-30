'use client';

import React, { useEffect, useState } from 'react';
// MUI
import { Stack, TextField, Box } from '@mui/material';
// utils
import { CalendarDate } from '@internationalized/date';
import { formatDate } from '@utils/datetime';
// our components
import BaseDialog, { DialogTextInput } from '@UI/Dialog/Dialog';
import Popover from '@UI/Dialog/Popover';
import CalendarPicker from '@UI/Calendar/CalendarPicker';
// schemas
import { Project, Workspace } from '@schemas';
// styles
import { calendar_picker_height } from '@const';

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
type Props = {
  workspace: Workspace;
  project?: Project;  // optional: passed when editing
  projectDialogOpen: boolean;
  onSubmitProject: (title: string, desc: string, dueDate: CalendarDate) => Promise<void>;
  closeProjectDialog: () => void;
};

/********************************************************************************************************************
 * project creation form
 ********************************************************************************************************************/
export default function ProjectForm({
  workspace,
  project,
  projectDialogOpen,
  onSubmitProject,
  closeProjectDialog,
}: Props) {
  // inputs
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<CalendarDate | null>(null);
  // UI
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  // state
  const [loading, setLoading] = useState(false);

  /******************************************************************************************************************
   * prefill/reset
   ******************************************************************************************************************/
  useEffect(() => {
    if (projectDialogOpen) {
      setTitle(project?.title || '');
      setDescription(project?.desc || '');
      setDueDate(project?.dueDate || null);
    }
  }, [projectDialogOpen, project]);

  /******************************************************************************************************************
   * submit
   ******************************************************************************************************************/
  const onDateSelected = (date: CalendarDate) => {
    setDueDate(date);
    setAnchorEl(null);
  }

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !dueDate) return;

    setLoading(true);
    try {
      await onSubmitProject(title.trim(), description.trim(), dueDate);
    } finally {
      closeProjectDialog();
      setLoading(false);
    }
  };

  /******************************************************************************************************************
   * utils
   ******************************************************************************************************************/
  const hasChanges =
    !project ||
    title.trim() !== project.title ||
    description.trim() !== project.desc ||
    (dueDate && project.dueDate.compare(dueDate) !== 0);

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <>
      {/* calendar popover */}
      <Popover anchorEl={anchorEl} setAnchorEl={setAnchorEl}>
        <Box sx={{ height: calendar_picker_height }}>
          <CalendarPicker
            defaultValue={project?.dueDate}
            onSelect={onDateSelected}
          />
        </Box>
      </Popover>

      {/* main form */}
      <BaseDialog
        open={projectDialogOpen}
        onClose={closeProjectDialog}
        onSubmit={handleSubmit}
        title={`${workspace.title} - ${project ? 'Edit Project' : 'New Project'}`}
        submitLabel={project ? 'Confirm' : 'Create'}
        disabled={!title || !description || !dueDate || !hasChanges}
        loading={loading}
      >
        <Stack spacing={2}>
          <DialogTextInput
            label='Project Title'
            required
            disabled={loading}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <DialogTextInput
            label='Project Description'
            rows={4}
            required
            disabled={loading}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label='Deadline'
            fullWidth
            required
            disabled={loading}
            value={dueDate ? formatDate(dueDate) : '--/--/----'}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            slotProps={{
              input: { readOnly: true },
            }}
            sx={{
              cursor: 'pointer',
              input: { cursor: 'pointer' },
            }}
          />
        </Stack>
      </BaseDialog>
    </>
  );
}
