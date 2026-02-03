import React, {useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import LoginForm from "./LoginForm";
import Fade from "@mui/material/Fade";


const LoginModal = ({isOpen, onClose}) => {
  const [tab, setTab] = useState(0);

  
  return (
    <Dialog open={isOpen} onClose={onClose} TransitionComponent={Fade} fullWidth maxWidth="xs" keepMounted PaperProps={{sx: {borderRadius: 3, bgcolor: "background.paper"},}}>
      <DialogTitle sx={{m: 0, p: 2, textAlign: "center", fontWeight: "bold"}}>
        {tab === 0 ? "Sign In" : "Sign Up"}
        <IconButton aria-label="close" onClick={onClose} sx={{position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500],}}>
          <CloseIcon/>
        </IconButton>
      </DialogTitle>

      <Box sx={{borderBottom: 1, borderColor: "divider", textAlign: "center"}}>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered textColor="primary" indicatorColor="primary">
          <Tab label="Sign In"/>
          <Tab label="Sign Up"/>
        </Tabs>
      </Box>

      <DialogContent dividers>
        <LoginForm mode={tab === 0 ? "signin" : "signup"} onSuccess={onClose}/>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;