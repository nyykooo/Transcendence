import { useState } from 'react';

import { Box, Typography, Stack } from '@mui/material';

export default function RecipeView() {
    const [title, setTitle] = useState('Recipe');
    const [content, setContent] = useState("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum");

    return (
        <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
            <Typography variant="h2">{title}</Typography>
            <Typography align='center' variant="body1">{content}</Typography>
        </Box>
    );
}