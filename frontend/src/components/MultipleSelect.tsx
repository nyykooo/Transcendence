import { FormControl, InputLabel, Select, MenuItem, OutlinedInput } from '@mui/material';
import { type MultipleSelectProps } from '../props/multiple-select-props';

export default function MultipleSelect({ name, options, selectedOptions, onChange }: MultipleSelectProps) {
    return ( 
        <FormControl sx={{ m: 1, width: '90%' }}>
            <InputLabel id="demo-multiple-name-label">{name}</InputLabel>
            <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={selectedOptions}
                onChange={onChange}
                input={<OutlinedInput label={name} />}
                MenuProps={{
                    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                    transformOrigin: { vertical: 'top', horizontal: 'left' },
                    disablePortal: true,
                    // ✅ Adicione estas duas linhas
                    disableRestoreFocus: true,  // Impede restaurar o foco ao fechar o menu
                    disableEnforceFocus: true,   // Não força o foco dentro do menu
                }}
            >
                {options.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}