import { Icon } from '@mui/material';

import type { LogoProps } from '../props/logoProps';

export default function Logo({ path, size, sx }: LogoProps) {
    const responsiveSize = typeof size === 'object' ? size : { xs: size, md: size };
    return (
        <Icon
            component="span"
            sx={{
                fontSize: responsiveSize,
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...sx,
            }}
        >
            <img
                src={path || undefined}
                alt="logo"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
            />
        </Icon>
    );
}