import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Logo } from '../components/components'

import { useAuth } from '../components/AuthProvider';

import { images } from '../configs/images'
import type { LoginProps } from '../props/loginProps';


export default function Login()
{
    const { signIn, completeTwoFactorSignIn } = useAuth();
    const navigate = useNavigate();

    const [pass, setPass] = useState<string>('');

    const handleUpdatePass = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPass(event.target.value);
    };

    const  [email, setEmail] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    const [twoFactorToken, setTwoFactorToken] = useState<string | null>(null);
    const [requiresTwoFactor, setRequiresTwoFactor] = useState<boolean>(false);

    const handleUpdateEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleUpdateOtp = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(event.target.value);
    };

    function validateEmailProps(email: string, password: string) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
    }

    const handleSubmitLogin = async () => {
        try {

            if (requiresTwoFactor) {
                if (!twoFactorToken) {
                    throw new Error('Missing 2FA challenge token. Please login again.');
                }
                if (!otp.trim()) {
                    throw new Error('OTP code is required');
                }

                await completeTwoFactorSignIn(twoFactorToken, otp.trim());
                navigate('/');
                return;
            }

            validateEmailProps(email, pass);

            const login: LoginProps = {
                email: email,
                password: pass
            };
            const res = await signIn(login);
            if (res?.requires2fa && res.twoFactorToken) {
                setTwoFactorToken(res.twoFactorToken);
                setRequiresTwoFactor(true);
                return;
            }

            navigate('/'); // navigates to home page after successful login
        } catch (err) {
            alert('Login failed: ' + err);
        }
    };

    const handleGithubLogin = async () => {
        try {
            await signIn(undefined, 'github');
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
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmitLogin(); }}>
                <Stack sx={{border: "black", borderRadius: "12px", display: "flex", flexDirection: "column"}}>
                    <TextField 
                        label="Email"
                        onChange={handleUpdateEmail}
                        color='secondary'
                    />
                    <TextField 
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        onChange={handleUpdatePass}
                        color='secondary'
                    />
                    {requiresTwoFactor && (
                        <TextField
                        label="2FA Code"
                        onChange={handleUpdateOtp}
                        color='secondary'
                        value={otp}
                        />
                    )}
                    <Button type="submit">
                        {requiresTwoFactor ? 'Verify 2FA' : 'Submit'}
                    </Button>
                    <Button
                        onClick={handleGithubLogin}
                        color='secondary'
                        >
                        Login using Github
                    </Button>
                    <Button
                        onClick={handleRegister}
                        color='secondary'
                        >
                        Register
                    </Button>
                </Stack>
        </form>
        </Box>
    );
}