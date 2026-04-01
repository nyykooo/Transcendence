import { useNavigate } from "react-router-dom";
import { type ProtectedRouteProps } from "../props/protectedRouteprops";
import { useAuth } from "./AuthProvider";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // console.log('ProtectedRoute: checking auth status', { user });
        if (user === null)
            navigate('/login', { replace: true });
    }, [navigate, user]);

    return children;
}