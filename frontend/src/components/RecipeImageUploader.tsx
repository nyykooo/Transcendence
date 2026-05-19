import { useRef } from 'react';
import { Button, Box, useTheme, useMediaQuery } from '@mui/material';
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
  const theme = useTheme();
  const isSmallOrMedium = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        minWidth: 0,
      }}
    >
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
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        sx={{
          minWidth: 0,
          maxWidth: '100%',
          '& .MuiButton-startIcon + span, & > span:last-child': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 'min(180px, 40vw)',
          },
        }}
      >
        {isSmallOrMedium ? (<AddPhotoAlternateIcon />) : (hasImage ? currentFile!.name : 'Add Image')}
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