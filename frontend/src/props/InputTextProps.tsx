import { TextField } from '@mui/material';

export type InputTextProps = {
    label: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    id: string;
    type?: string;
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
} & Omit<React.ComponentProps<typeof TextField>, 'label' | 'value' | 'onChange' | 'type'>;