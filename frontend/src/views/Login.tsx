import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Box, Stack, TextField, Button } from '@mui/material'

import { Logo } from '../components/components'

import { useAuth } from '../components/AuthProvider';

import { images } from '../configs/images'
import type { LoginProps } from '../props/loginProps';


export default function Login()
{
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const [pass, setPass] = useState<string>('');

    const handleUpdatePass = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPass(event.target.value);
    };

    const  [email, setEmail] = useState<string>('');

    const handleUpdateEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    function validateEmailProps(email: string, password: string) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
    }

    const handleSubmitLogin = async () => {
        try {

            validateEmailProps(email, pass);

            const login: LoginProps = {
                email: email,
                password: pass
            };
            await signIn(login);
            navigate('/'); // navigates to home page after successful login
        } catch (err) {
            alert('Login failed: ' + err);
        }
    };

    const handleGithubLogin = async () => {
        try {
            const login: LoginProps = {
                email: email,
                password: pass
            };
            await signIn(login, 'github');
            navigate('/'); // navigates to home page after successful login
        } catch (err) {
            alert('Login failed: ' + err);
        }
    };

    const handleRegister = async () => {
            navigate('/register');
    };

    return (
        <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
            <Logo size={300} path={images.icons.logo}/>
            <Stack sx={{border: "black", borderRadius: "12px", display: "flex", flexDirection: "column"}}>
                <TextField 
                    label="Email"
                    onChange={handleUpdateEmail}
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
                <Button
                    onClick={handleGithubLogin}
                >
                    Login using Github
                </Button>
                <Button
                    onClick={handleRegister}
                >
                    Register
                </Button>
            </Stack>
        </Box>
    );
}