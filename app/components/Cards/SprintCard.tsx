'use client';

// MUI
import { Box, Card, CardContent, Typography, Stack, LinearProgress } from '@mui/material';

type Props = {
  title: string;
  desc: string;
  completed: number;
  total: number;
};

/**
 * sprint details card
 */
export default function SprintCard({ title, desc, completed, total }: Props) {
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant='subtitle1' fontWeight={600}>
          {title}
        </Typography>
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{
            mt: 0.5,
            lineHeight: 1.4,
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
          }}
        >
          {desc}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction='row' alignItems='center' spacing={1} mt={2}>
          <Typography variant='caption' sx={{ whiteSpace: 'nowrap' }}>
            {`${completed}/${total} Tasks`}
          </Typography>
          <LinearProgress
            variant='determinate'
            value={progress}
            sx={{ flex: 1, height: 6, borderRadius: 3 }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};