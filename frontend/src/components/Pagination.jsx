import React from 'react';
import { Box, Button, Stack } from '@mui/material';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const pageButtonSx = {
    minWidth: 36,
    width: 36,
    height: 36,
    borderRadius: 2,
    textTransform: 'none',
    fontSize: '0.875rem',
    px: 0,
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 1 }}>
      <Button
        variant="outlined"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        sx={{ borderRadius: 2, textTransform: 'none', px: 2, minWidth: 90 }}
      >
        Previous
      </Button>

      <Stack direction="row" spacing={1}>
        {pages.map((page) => (
          <Button
            key={page}
            onClick={() => onPageChange(page)}
            variant={currentPage === page ? 'contained' : 'outlined'}
            color={currentPage === page ? 'primary' : 'inherit'}
            sx={{
              ...pageButtonSx,
              borderColor: currentPage === page ? 'primary.main' : 'divider',
              bgcolor: currentPage === page ? 'primary.main' : 'background.paper',
              color: currentPage === page ? 'common.white' : 'text.primary',
              '&:hover': {
                bgcolor: currentPage === page ? 'primary.dark' : 'action.hover',
              },
            }}
          >
            {page}
          </Button>
        ))}
      </Stack>

      <Button
        variant="outlined"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        sx={{ borderRadius: 2, textTransform: 'none', px: 2, minWidth: 90 }}
      >
        Next
      </Button>
    </Box>
  );
};

export default Pagination;