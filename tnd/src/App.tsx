import { useState } from 'react';

import { Typography, Button, TextField } from '@mui/material';

export default function App() {

    const [text, setText] = useState<string>("Welcome to Transcendence!");
    const [input, setInput] = useState<string>("");

    function updateInput(event: React.ChangeEvent<HTMLInputElement>)
    {
        setInput(event.target.value);
    }

    function updateText()
    {
        if (input.trim() === "")
            return;
        setText(input);
    }

    return (
        <div>
            <Typography variant='h2'>{text}</Typography>
            <Button variant='contained' onClick={updateText}>Update</Button>
            <TextField value={input} onChange={updateInput}></TextField>
        </div>
    );
}