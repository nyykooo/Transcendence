import type { SxProps } from '@mui/system';

export type LogoProps = {
    path: string;
    size: number | { xs?: number; sm?: number; md?: number; lg?: number };  // Novo tipo
    sx?: SxProps;
}