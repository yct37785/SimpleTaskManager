'use client';

// MUI
import { Box, Typography, Card, CardContent, CardActionArea, Stack, } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
// our components
import SprintCard from '@components/Cards/SprintCard';
// defines
import { Project } from '@defines/schemas';

type Props = {
  project: Project;
};

/**
 * sprints
 */
export default function SprintList({ project }: Props) {
  return (
    <Box sx={{ mb: 4 }}>
      {/* header */}
      <Typography variant='h6' fontWeight={500} sx={{ mb: 2 }}>
        Sprints
      </Typography>

      {/* grid */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
        }}
      >
        {/* existing sprints */}
        {project.sprints.map((sprint, idx) => {
          const totalTasks = sprint.columns.reduce((sum, col) => sum + col.tasks.length, 0);
          const completedTasks = sprint.columns
            .find(col => col.title.toLowerCase() === 'done')
            ?.tasks.length ?? 0;

          return (
            <SprintCard
              key={idx}
              title={sprint.title}
              desc={sprint.desc}
              completed={completedTasks}
              total={totalTasks}
            />
          );
        })}

        {/* add sprint */}
        <Card
          variant='outlined'
          sx={{
            borderStyle: 'dashed',
            color: 'primary.main',
            backgroundColor: 'background.default',
            height: '100%',
          }}
        >
          <CardActionArea
            onClick={() => {
              console.log('Add Sprint clicked');
            }}
            sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
          >
            <Stack direction='row' alignItems='center' spacing={1}>
              <AddIcon />
              <Typography variant='body1' fontWeight={500}>
                Add Sprint
              </Typography>
            </Stack>
          </CardActionArea>
        </Card>
      </Box>
    </Box>
  );
}
