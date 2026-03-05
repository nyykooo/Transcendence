import  { BottomNavigation, BottomNavigationAction,  Typography } from "@mui/material";

export default function Footer() {
    return (
    <BottomNavigation showLabels>
        <BottomNavigationAction label="Home" />
        <BottomNavigationAction label=" &copy; 2026 Transcendence. All rights reserved." />
    </BottomNavigation>
    );
}