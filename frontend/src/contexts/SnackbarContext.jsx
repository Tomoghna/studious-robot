import React, { createContext, useContext, useState, useCallback } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const SnackbarContext = createContext();
export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);

  // 👉 Add snackbar to queue
  const showSnackbar = useCallback((message, options = {}) => {
    setQueue((prev) => [...prev, { message, ...options }]);
  }, []);

  // 👉 When one finishes, show next
  React.useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
      setQueue((prev) => prev.slice(1));
    }
  }, [queue, current]);

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setCurrent(null);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      {current && (
        <Snackbar
          open
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={current.severity || "info"}
            variant="filled"
            action={
              <>
                {current.undo && (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => {
                      current.undo();
                      handleClose();
                    }}
                  >
                    UNDO
                  </Button>
                )}
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={handleClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </>
            }
          >
            {current.message}
          </Alert>
        </Snackbar>
      )}
    </SnackbarContext.Provider>
  );
};
