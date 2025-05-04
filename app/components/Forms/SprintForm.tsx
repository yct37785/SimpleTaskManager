'use client';

import React, { useEffect, useState } from 'react';
// MUI
import { Stack, Box } from '@mui/material';
// our components
import BaseDialog, { DialogTextInput } from '@UI/Dialog/Dialog';
// schemas
import { Project } from '@schemas';

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
type Props = {
  project: Project;
  sprintDialogOpen: boolean;
  handleCreateSprint: (title: string, desc: string) => void;
  closeSprintDialog: () => void;
};

/********************************************************************************************************************
 * project creation form
 ********************************************************************************************************************/
export default function ProjectForm({ project, sprintDialogOpen, handleCreateSprint, closeSprintDialog }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  /******************************************************************************************************************
   * do reset when close
   ******************************************************************************************************************/
  useEffect(() => {
    if (!sprintDialogOpen) {
      setTitle('');
      setDescription('');
    }
  }, [sprintDialogOpen]);

  /******************************************************************************************************************
   * submit
   ******************************************************************************************************************/
  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;

    handleCreateSprint(title, description);
    closeSprintDialog();
  }

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <>
      {/* main form */}
      <BaseDialog
        open={sprintDialogOpen}
        onClose={closeSprintDialog}
        onSubmit={handleSubmit}
        title={`${project.title} - New Sprint`}
        disabled={!title || !description}
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
        </Stack>
      </BaseDialog>
    </>
  );
}
