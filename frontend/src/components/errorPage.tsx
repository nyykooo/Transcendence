import { Box, Typography } from "@mui/material";
import { type ErrorPageProps } from "../props/ErrorPageProps";

export default function ErrorPage(props: ErrorPageProps) {
    return (
        <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
            <Typography variant="h1" color="error">Error</Typography>
            <Typography variant="h2" color="error">{props.status}</Typography>
            <Typography align='center' variant="body1" color="error">{props.message}</Typography>
        </Box>
    );
}