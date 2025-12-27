import React, {useState, useEffect} from "react";
import {useAuth} from "../contexts/AuthContext";
// ...existing code...
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import GoogleIcon from "@mui/icons-material/Google";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import Alert from "@mui/material/Alert";

const LoginForm = ({onSuccess, mode: initialMode = "signin"}) => {
    const {login, signup} = useAuth();
    const [mode, setMode] = useState(initialMode);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    //update mode when initalMode prop changes
    useEffect(() => {
        setMode(initialMode);
        setEmail("");
        setPassword("");
        setName("");
        setError("");
    }, [initialMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setError("");
        setIsSubmitting(true);
        try {
            let returnedUser = null;
            if (mode === "signup") {
                returnedUser = await signup(email, password, name);
            } else {
                returnedUser = await login(email, password);
            }

            // Notify parent to close modal / handle navigation
            onSuccess && onSuccess(returnedUser);
        } catch (err) {
            setError("Invalid credentials or network error.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
                <Button variant="outlined" color="inherit" startIcon={<GoogleIcon/>} fullWidth>Continue with Google</Button>
                <Button variant="outlined" color="inherit" startIcon={<SmartphoneIcon/>} fullWidth>Continue with Mobile</Button>

                <Divider>or</Divider>

                {mode === "signup" && (
                    <TextField label="Full Name" variant="outlined" fullWidth value={name} onChange={(e) => setName(e.target.value)} required/>
                )}

                <TextField label="Email" variant="outlined" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} required/>

                <TextField label="Password" variant="outlined" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} required/>

                {error && <Alert severity="error">{error}</Alert>}

                <Button type="submit" variant="contained" color="primary" fullWidth sx={{mt: 1, py: 1}} disabled={isSubmitting}>
                    {mode === "signup" ? "Sign Up" : "Sign In"}
                </Button>
            </Stack>
        </form>
    );
};

export default LoginForm;