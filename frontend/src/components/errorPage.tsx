import { Box, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { type ErrorPageProps } from "../props/ErrorPageProps";

export default function ErrorPage(props: ErrorPageProps) {
    return (
        <Box sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            textAlign: 'center',
            px: 3,
        }}>
            <Box sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'error.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.15,
                position: 'relative',
            }}>
                <ErrorOutlineIcon sx={{
                    fontSize: 40,
                    color: '#ffffff',
                    position: 'absolute',
                    opacity: 1,
                }} />
            </Box>

            <Typography
                variant="overline"
                color="error"
                sx={{ letterSpacing: 2, fontWeight: 500 }}
            >
                Error {props.status}
            </Typography>

            <Typography variant="h5" color="text.primary" fontWeight={500}>
                Something went wrong
            </Typography>

            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 400, lineHeight: 1.7 }}
            >
                {props.message}
            </Typography>
        </Box>
    );
}