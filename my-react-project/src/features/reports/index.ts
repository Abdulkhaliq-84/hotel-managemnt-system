// Export main component wrapped with ErrorBoundary and Suspense
export { default as ReportsPage } from './components/ReportsPageWrapper';

// Export sub-components if needed elsewhere
export { default as KpiCards } from './components/KpiCards';
export { default as SimpleChart } from './components/SimpleChart';

// Export types
export * from './types/report.types';

// Export utilities if needed elsewhere
export * from './utils/reportDataGenerator';
