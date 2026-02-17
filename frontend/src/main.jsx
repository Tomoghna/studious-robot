import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {AuthProvider} from "./contexts/AuthContext.jsx";
import { AlertProvider } from "./contexts/AlertContext.jsx";
import { SnackbarProvider } from "./contexts/SnackbarContext.jsx";
import {ThemeModeProvider} from "./contexts/ThemeContext";
import { AuthModalProvider } from './contexts/AuthModalContext';
import { CategoryProvider } from "./contexts/CategoryContext.jsx";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <AlertProvider>
        <SnackbarProvider>
          <AuthProvider>
            <AuthModalProvider>
              <CategoryProvider>
                <App />
              </CategoryProvider>
            </AuthModalProvider>
          </AuthProvider>
        </SnackbarProvider>
      </AlertProvider>
    </ThemeModeProvider>
  </React.StrictMode>
);
