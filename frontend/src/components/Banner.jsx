import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

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
      <Box sx={{ position: 'absolute', top: 24, left: 24, display: { xs: 'none', sm: 'block' } }}>
        <Typography variant="h4" color="text.primary" sx={{ fontWeight: 800 }}>New Collections</Typography>
      </Box>
    </Box>
  )
}
