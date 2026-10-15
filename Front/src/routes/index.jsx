import ErrorBoundary from '../components/ErrorBoundary';

// In your routes configuration
<Route 
  path="/profile" element={
    <ErrorBoundary>
      <Profile />
    </ErrorBoundary>
  } 
/>