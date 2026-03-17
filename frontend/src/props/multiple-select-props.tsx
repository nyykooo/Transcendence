import { type SelectChangeEvent } from '@mui/material';

export type MultipleSelectProps = {
    name: string;
    options: string[];
    selectedOptions: string[];
    onChange: (event: SelectChangeEvent<string[]>) => void;
}