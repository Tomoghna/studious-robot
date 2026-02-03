import React, { useState, useEffect } from 'react';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Zoom from '@mui/material/Zoom';
import useScrollTrigger from '@mui/material/useScrollTrigger';

export default function BackToTop() {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 300 });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Zoom in={trigger}>
      <Fab color="primary" size="small" onClick={handleClick} aria-label="back to top" sx={{ position: 'fixed', right: 16, bottom: 72 }}>
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
}
