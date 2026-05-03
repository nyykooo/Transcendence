import { useNavigate } from "react-router-dom";

import  { BottomNavigation, BottomNavigationAction } from "@mui/material";

import { paths } from '../configs/routes';


export default function Footer() {
    const navigate = useNavigate();

    function updatePage(path: string) {
        navigate(path);
        console.log('navigate to', path);
    }

    return (
        <BottomNavigation showLabels>
            <BottomNavigationAction onClick={() => updatePage(paths.privacyPolicy.path)} label="Privacy Policy" />
            <BottomNavigationAction disabled label=" &copy; 2026 Transcendence. All rights reserved." />
            <BottomNavigationAction onClick={() => updatePage(paths.termsOfService.path)} label="Terms of Service" />
        </BottomNavigation>
    );
}