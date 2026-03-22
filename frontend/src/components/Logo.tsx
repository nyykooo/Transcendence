import { Icon } from '@mui/material';

import type { LogoProps } from '../props/logoProps';

export default function Logo({ path, size, sx }: LogoProps) {

    return (
        <Icon
            component="span"
            sx={{
                fontSize: size,
                lineHeight: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...sx,
            }}
        >
            <img
                src={path}
                alt="logo"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                }}
            />
        </Icon>
    );
}