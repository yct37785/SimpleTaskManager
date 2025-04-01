'use client';

import { useState, useEffect } from 'react';
// next
import { useParams } from 'next/navigation';
// MUI
import { Box, Typography, Divider, Tooltip, Button, IconButton, Stack, Card, CardContent, CardActionArea } from '@mui/material';
import { Edit as EditIcon, CalendarMonth as CalendarMonthIcon, Add as AddIcon } from '@mui/icons-material';
// date
import { getLocalTimeZone, today, CalendarDate } from '@internationalized/date';
// utils
import { getRelativeTime } from '@utils/datetimeUtils';
// defines
import { Project } from '@defines/schemas';
// styles
import styles from './ProjectPage.module.css';

type Props = {
  project: Project;
};

/**
 * sprints
 */
export default function SprintList({ project }: Props) {

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant='h6' fontWeight={500} sx={{ mb: 2 }}>
        Sprints
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {project.sprints.map((sprint, idx) => (
          <Card key={idx} sx={{ width: 280, flex: '1 1 auto' }}>
            <CardContent>
              <Typography variant='subtitle1' fontWeight={600}>
                {sprint.title}
              </Typography>
              <Typography
                variant='body2'
                color='text.secondary'
                sx={{ mt: 0.5, lineHeight: 1.4 }}
              >
                {sprint.desc}
              </Typography>
            </CardContent>
          </Card>
        ))}

        {/* add sprint */}
        <Box
          sx={{
            width: 280,
            flex: '1 1 auto',
            border: '1px dashed',
            borderColor: 'primary.main',
            color: 'primary.main',
            backgroundColor: 'background.default',
          }}
        >
          <CardActionArea
            onClick={() => {
              // TODO: open your add sprint dialog here
              console.log('Add Sprint clicked');
            }}
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
            }}
          >
            <Stack direction='row' alignItems='center' spacing={1}>
              <AddIcon />
              <Typography variant='body1' fontWeight={500}>
                Add Sprint
              </Typography>
            </Stack>
          </CardActionArea>
        </Box>
      </Box>
    </Box>
  );
};