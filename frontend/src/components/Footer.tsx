import { useNavigate } from "react-router-dom";

import  { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";

import { paths } from '../configs/routes';


export default function Footer() {
    const navigate = useNavigate();

    function updatePage(path: string) {
        navigate(path);
        console.log('navigate to', path);
    }

    return (
        <Box sx={{ width: '100%', position: 'fixed', bottom: 0 }}>
            <BottomNavigation showLabels>
                <BottomNavigationAction onClick={() => updatePage(paths.privacyPolicy.path)} label="Privacy Policy" />
                <BottomNavigationAction disabled label=" &copy; 2026 Transcendence. All rights reserved." />
                <BottomNavigationAction onClick={() => updatePage(paths.termsOfService.path)} label="Terms of Service" />
            </BottomNavigation>
        </Box>
    );
}