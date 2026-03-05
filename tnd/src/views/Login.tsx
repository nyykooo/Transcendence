import { Box, Stack, TextField } from '@mui/material'

import { Logo } from '../components/components'

import { images } from '../configs/images'

export default function Login()
{
    return (
        <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
            <Logo size={300} path={images.icons.logo}/>
            <Stack sx={{border: "black", borderRadius: "12px", display: "flex", flexDirection: "column"}}>
                <TextField label="user"/>
                <TextField 
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"/>
            </Stack>
        </Box>
    );
}