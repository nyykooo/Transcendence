import { useNavigate } from "react-router-dom";
import { type ProtectedRouteProps } from "../props/protectedRouteprops";
import { useAuth } from "./AuthProvider";
import { useEffect } from "react";
import { checkToken } from "../api/login";

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, authReady } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authReady) {
            return;
        }

        const verifyToken = async () => {
            // console.log('ProtectedRoute: checking auth status', { user });
            try {
                if (user === null) {
                    throw new Error('No user authenticated');
                } else {
                    await checkToken();
                }
            } catch (error: any) {
                navigate('/login', { replace: true });
            }
        };

        verifyToken();
    }, [authReady, navigate, user]);

    return children;
}