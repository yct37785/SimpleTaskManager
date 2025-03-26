'use client';

import { Box, Slider, Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

type Props = {
  label: string;
  range: [number, number];               // epoch days
  setRange: (val: [number, number]) => void;
  minEpoch: number;
  maxEpoch: number;
};

export default function CalendarSlider({ label, range, setRange, minEpoch, maxEpoch }: Props) {
  const toValue = (epoch: number) => Math.floor((epoch - minEpoch) / 86400);
  const toEpoch = (val: number) => minEpoch + val * 86400;

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    const [start, end] = newValue as [number, number];
    setRange([toEpoch(start), toEpoch(end)]);
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant='subtitle1' sx={{ mb: 2 }}>{label}</Typography>
      <Stack spacing={2}>
        <DatePicker
          label='Start Date'
          value={dayjs.unix(range[0])}
          onChange={(date) =>
            date && setRange([date.startOf('day').unix(), range[1]])
          }
          minDate={dayjs.unix(minEpoch)}
          maxDate={dayjs.unix(maxEpoch)}
        />
        <DatePicker
          label='End Date'
          value={dayjs.unix(range[1])}
          onChange={(date) =>
            date && setRange([range[0], date.startOf('day').unix()])
          }
          minDate={dayjs.unix(minEpoch)}
          maxDate={dayjs.unix(maxEpoch)}
        />
        <Slider
          value={[toValue(range[0]), toValue(range[1])]}
          min={0}
          max={toValue(maxEpoch)}
          onChange={handleSliderChange}
          valueLabelDisplay='auto'
          valueLabelFormat={(v) => dayjs.unix(toEpoch(v)).format('MMM D')}
          marks
        />
      </Stack>
    </Box>
  );
};