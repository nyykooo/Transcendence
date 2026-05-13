import { Box, Slider, Typography, FormControl } from '@mui/material';

import { type SliderSelectorProps } from '../props/slider-selector-props';

export default function SliderSelector({ min, max, value, valueText = '', name, onChange, step = 1 }: SliderSelectorProps) {
  const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
  const safeMin = Number.isFinite(min) ? min : 0;
  const rawMax = Number.isFinite(max) ? max : safeMin + safeStep;
  const safeMax = rawMax > safeMin ? rawMax : safeMin + safeStep;

  const safeValue: number[] = Array.isArray(value)
    ? [
        Number.isFinite(value[0]) ? Math.max(safeMin, Math.min(value[0], safeMax)) : safeMin,
        Number.isFinite(value[1]) ? Math.max(safeMin, Math.min(value[1], safeMax)) : safeMax,
      ]
    : [safeMin, safeMax];

  const valuetext = (value: number) => {
    return `${value}${valueText}`;
  }

  return (
    <FormControl sx={{ m: 1, width: 300 }}>
      <Box sx={{ m: 1, width: "90%" }}>
        <Typography id="input-slider" gutterBottom>
          {name} ({valueText})
        </Typography>
        <Slider
          getAriaLabel={() => 'Minimum distance'}
          value={safeValue}
          onChange={onChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          disableSwap
          min={safeMin}
          max={safeMax}
          step={safeStep}
          color="secondary"
          size='medium'
        />
      </Box>
    </FormControl>
  );
}
