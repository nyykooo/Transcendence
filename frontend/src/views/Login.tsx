import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Box, Stack, TextField, Button } from '@mui/material'

import { Logo } from '../components/components'

import { useAuth } from '../components/AuthProvider';

import { images } from '../configs/images'


export default function Login()
{
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const [pass, setPass] = useState<string>('');

    const handleUpdatePass = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPass(event.target.value);
    };

    const  [user, setUser] = useState<string>('');

    const handleUpdateUser = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUser(event.target.value);
    };

    const handleSubmitLogin = async () => {
        try {
            const login = {
                username: user,
                password: pass
            };
            console.log(login);
            await signIn(login);
            navigate('/'); // redireciona após login
        } catch (err) {
            console.error('Falha no login:', err);
            // exibe mensagem de erro pro usuário
        }
};

    return (
        <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
            <Logo size={300} path={images.icons.logo}/>
            <Stack sx={{border: "black", borderRadius: "12px", display: "flex", flexDirection: "column"}}>
                <TextField 
                    label="user"
                    onChange={handleUpdateUser}
                />
                <TextField 
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    onChange={handleUpdatePass}
                />
                <Button
                    onClick={handleSubmitLogin}
                >
                    Submit
                </Button>
            </Stack>
        </Box>
    );
}