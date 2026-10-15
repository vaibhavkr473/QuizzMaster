import React from 'react';
import Box from '@mui/material/Box';

const Layout = ({ children }) => {
  return (
    <Box sx={{ 
      padding: '2rem 0',
      minHeight: 'calc(100vh - 64px - 200px)',
    }}>
      {children}
    </Box>
  );
};

export default Layout;