import { Box, Slider, Typography } from '@mui/material';

import { type SliderSelectorProps } from '../props/slider-selector-props';

export default function SliderSelector({ min, max, value, valueText = '', name, onChange }: SliderSelectorProps) {  
  const valuetext = (value: number) => {
    return `${value}${valueText}`;
  }

  return (
    <Box sx={{ m: 1, width: 300 }}>
      <Typography id="input-slider" gutterBottom>
        {name} ({valueText})
      </Typography>
      <Slider
        getAriaLabel={() => 'Minimum distance'}
        value={value}
        onChange={onChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        disableSwap
        min={min}
        max={max}
      />
    </Box>
  );
}
