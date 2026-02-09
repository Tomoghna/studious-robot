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
import { FilledInput, IconButton } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const LoginForm = ({onSuccess, mode: initialMode = "signin"}) => {
    const {login, signup} = useAuth();
    const [mode, setMode] = useState(initialMode);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    //update mode when initalMode prop changes
    useEffect(() => {
        setMode(initialMode);
        setEmail("");
        setPassword("");
        setName("");
        setError("");
    }, [initialMode]);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

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
                {mode === "signup" && (
                    <TextField label="Full Name" variant="outlined" fullWidth value={name} onChange={(e) => setName(e.target.value)} required/>
                )}

                <TextField label="Email" variant="outlined" type="email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} required/>
                
                <FormControl sx={{m: 1, width: '45ch'}} variant="outlined">
                    <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
                    <FilledInput
                        id="filled-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setPassword(e.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={
                                        showPassword ? "hide the password" : "display the password"
                                    }
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>

                {error && <Alert severity="error">{error}</Alert>}

                <Button type="submit" variant="contained" color="primary" fullWidth sx={{mt: 1, py: 1}} disabled={isSubmitting}>
                    {mode === "signup" ? "Sign Up" : "Sign In"}
                </Button>
            </Stack>
        </form>
    );
};

export default LoginForm;