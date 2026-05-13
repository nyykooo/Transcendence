import { Box, TextField } from '@mui/material';

import { type InputTextProps } from '../props/InputTextProps';

export default function InputText({
    label,
    onChange,
    id,
    type = 'text',
    color = 'primary',
}: InputTextProps) {
    return (
        <Box sx={{ width: '100%', paddingTop: '8px' }}>
            <TextField
                label={label}
                onChange={onChange}
                type={type}
                color={color}
                id={id}
            />
        </Box>
    );
}