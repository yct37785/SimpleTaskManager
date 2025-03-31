'use client';

import React, { useState } from 'react';
// MUI
import { TextField, Chip, Autocomplete } from '@mui/material';
// defines
import { Task, Label } from '@defines/schemas';

type Props = {
  labels: Label[];
  setLabels: (labels: Label[]) => void;
};

/**
 * label selector
 */
export default function LabelSelector({ labels, setLabels }: Props) {
  return (
    <Autocomplete
      multiple
      freeSolo
      options={[]}
      value={labels.map((l) => l.title)}
      onChange={(event, newValues) => {
        const newLabels: Label[] = newValues.map((val) => {
          const existing = labels.find((l) => l.title === val);
          return existing || {
            title: val,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16),
          };
        });
        setLabels(newLabels);
      }}
      renderTags={(value: readonly string[], getTagProps) =>
        value.map((option, index) => {
          const label = labels.find((l) => l.title === option);
          return (
            <Chip
              {...getTagProps({ index })}
              label={option}
              key={option}
              sx={{ bgcolor: label?.color || 'grey.300', color: 'white' }}
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField {...params} label='Labels (optional)' placeholder='Type and press enter' multiline />
      )}
    />
  );
};