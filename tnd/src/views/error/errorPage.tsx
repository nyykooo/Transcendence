import { Box, Typography } from "@mui/material";
import { type ErrorPageProps } from "../../props/ErrorPageProps";

export default function ErrorPage(props: ErrorPageProps) {
    return (
        <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
            <Typography variant="h1">Error</Typography>
            <Typography variant="h2">{props.status}</Typography>
            <Typography align='center' variant="body1">{props.message}</Typography>
        </Box>
    );
}