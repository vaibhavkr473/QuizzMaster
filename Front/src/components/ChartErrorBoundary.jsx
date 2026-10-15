import React from 'react';
import { Typography, Box } from '@mui/material';

class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box display="flex" alignItems="center" justifyContent="center" height={300}>
          <Typography variant="body1" color="text.secondary">
            Unable to display chart
          </Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ChartErrorBoundary;