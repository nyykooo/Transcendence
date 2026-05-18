import { useRef } from 'react';
import { Button, Box } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

interface RecipeImageUploaderProps {
    index: number;
    currentFile?: File;
    onChange: (index: number, file: File | undefined) => void;
    disabled?: boolean;
}

export default function RecipeImageUploader({
    index,
    currentFile,
    onChange,
    disabled,
}: RecipeImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const hasImage = Boolean(currentFile);

    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                disabled={disabled}
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        onChange(index, e.target.files[0]);
                        e.target.value = '';
                        buttonRef.current?.blur();
                    }
                }}
            />
            <Button
                ref={buttonRef}
                size="small"
                variant={hasImage ? 'outlined' : 'contained'}
                color={hasImage ? 'success' : 'primary'}
                startIcon={<AddPhotoAlternateIcon />}
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
            >
                {hasImage ? currentFile!.name.substring(0, 20) : 'Add Image'}
            </Button>
            {hasImage && (
                <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    disabled={disabled}
                    onClick={() => onChange(index, undefined)}
                >
                    Remove
                </Button>
            )}
        </Box>
    );
}