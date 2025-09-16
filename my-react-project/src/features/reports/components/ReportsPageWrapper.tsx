import type { FC } from 'react';
import ErrorBoundary from './ErrorBoundary';
import ReportsPageComponent from './ReportsPage';
import ReportsPageSimple from './ReportsPageSimple';

const ReportsPageWrapper: FC = () => {
  console.log('ReportsPage wrapper rendering...');
  
  // Temporarily use simple version to test if routing works
  const useSimple = false; // Change to true to use simple version
  
  if (useSimple) {
    return (
      <ErrorBoundary>
        <ReportsPageSimple />
      </ErrorBoundary>
    );
  }
  
  // Try without Suspense first to isolate the issue
  return (
    <ErrorBoundary>
      <ReportsPageComponent />
    </ErrorBoundary>
  );
};

export default ReportsPageWrapper;
