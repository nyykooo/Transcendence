import  { BottomNavigation, Typography } from "@mui/material";

export default function Footer() {
    return (
        <BottomNavigation
            sx={{
                color: "black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "60px",
            }}
        >
            <Typography variant="body2" color="textSecondary">
                &copy; 2026 Transcendence. All rights reserved.
            </Typography>
        </BottomNavigation>
    );
}