import React, {createContext, useContext, useState, useCallback, useEffect} from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);


function SlideTransition(props) {
    return <Slide {...props} direction="down"/>;
}


export const SnackbarProvider = ({children}) => {
    const [snackPack, setSnackPack] = useState([]);
    const [open, setOpen] = useState(false);
    const [messageInfo, setMessageInfo] = useState(undefined);

    const showSnackbar = useCallback((message, severity = "info", duration = 3000) => {
        setSnackPack((prev) => [...prev, {message, severity, duration, key: new Date().getTime()}]);
    }, []);

    useEffect(() => {
        if (snackPack.length && !messageInfo) {
            setMessageInfo({...snackPack[0]});
            setSnackPack((prev) => prev.slice(1));
            setOpen(true);
        }
        else if (snackPack.length && messageInfo && open) {
            setOpen(false);
        }
    }, [snackPack, messageInfo, open]);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };

    const handleExited = () => {
        setMessageInfo(undefined);
    };

    return (
        <SnackbarContext.Provider value={{showSnackbar}}>
            {children}
            <Snackbar key={messageInfo ? messageInfo.key : undefined} open={open} autoHideDuration={messageInfo?.duration || 3000} onClose={handleClose} TransitionProps={{onExited: handleExited}} TransitionComponent={SlideTransition} anchorOrigin={{vertical: "top", horizontal: "center"}}>
                {messageInfo ? (
                    <Alert onClose={handleClose} severity={messageInfo.severity} variant="filled" sx={{ width: "100%", boxShadow: 2, borderRadius: "12px",}}>{messageInfo.message}</Alert>
                ): null}
            </Snackbar>
        </SnackbarContext.Provider>
    );
};