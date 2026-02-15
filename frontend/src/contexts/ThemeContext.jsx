import React, {createContext, useContext, useMemo, useState} from "react";
import {createTheme, ThemeProvider, CssBaseline} from "@mui/material";


const ThemeModeContext = createContext();

export const UseThemeMode = () => useContext(ThemeModeContext);

export const ThemeModeProvider = ({children}) => {
    const [mode, setMode] = useState("light");

    const toggleTheme = () => setMode(prev => (prev === "light" ? "dark" : "light"));

    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            primary: {main: mode === "light" ? "#1976d2" : "#90caf9"},
            background: {
                default: mode === "light" ? "#fafafa" : "#121212",
                paper: mode === "light" ? "#fff" : "#1e1e1e",
            },
        },
        typography: {
            fontFamily: "Poppins, sans-serif",
            h1: { fontWeight: 700 },
            h2: { fontWeight: 600 },
            h3: { fontWeight: 500 },
            button: { textTransform: "none" },
        },
        shape: {borderRadius: 10},
    }), [mode]);

    return (
        <ThemeModeContext.Provider value={{mode, toggleTheme}}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {children}
            </ThemeProvider>
        </ThemeModeContext.Provider>
    );
};