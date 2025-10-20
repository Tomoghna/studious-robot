import React from 'react'
import Box from '@mui/material/Box'

export default function Banner() {
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.default' }}>
      <Box
        component="img"
        src="/banner-2.jpg"
        alt="banner"
        loading="eager"
        sx={{ width: '100%', height: { xs: 140, sm: 200, md: 300 }, objectFit: 'cover' }}
      />
    </Box>
  )
}
