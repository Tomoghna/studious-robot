import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {AuthProvider} from "./contexts/AuthContext.jsx";
import {SnackbarProvider} from "./contexts/SnackbarContext";
import {ThemeModeProvider} from "./contexts/ThemeContext";
import { AuthModalProvider } from './contexts/AuthModalContext';
import { CategoryProvider } from "./contexts/CategoryContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <SnackbarProvider>
        <AuthProvider>
          <AuthModalProvider>
            <CategoryProvider>
              <App />
            </CategoryProvider>
          </AuthModalProvider>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeModeProvider>
  </React.StrictMode>
);
