// RecipeImageUploader.tsx
import { useRef } from 'react';
import { Button, Box } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

interface RecipeImageUploaderProps {
    index: number;
    recipeName: string;
    currentFile?: File;
    onChange: (index: number, file: File | undefined) => void;
}

export default function RecipeImageUploader({
    index,
    // recipeName,
    currentFile,
    onChange,
}: RecipeImageUploaderProps) {
    // Cada instância deste componente tem o seu próprio ref isolado
    const inputRef = useRef<HTMLInputElement>(null);

    const hasImage = Boolean(currentFile);

    return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Input escondido, controlado por ref */}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        onChange(index, e.target.files[0]);
                        // Reset para permitir selecionar o mesmo ficheiro novamente
                        e.target.value = '';
                    }
                }}
            />

            {/* Botão real (não span), sem label */}
            <Button
                size="small"
                variant={hasImage ? 'outlined' : 'contained'}
                color={hasImage ? 'success' : 'primary'}
                startIcon={<AddPhotoAlternateIcon />}
                onClick={() => inputRef.current?.click()}
            >
                {hasImage ? currentFile!.name.substring(0, 20) : 'Add Image'}
            </Button>

            {hasImage && (
                <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => onChange(index, undefined)}
                >
                    Remove
                </Button>
            )}
        </Box>
    );
}