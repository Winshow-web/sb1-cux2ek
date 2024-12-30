import { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface DriverDashboardLayoutProps {
  mainContent: ReactNode;
  sidebar: ReactNode;
}

export default function DriverDashboardLayout({ mainContent, sidebar }: DriverDashboardLayoutProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        <div className="flex-1">
          <ErrorBoundary>{mainContent}</ErrorBoundary>
        </div>
        <div className="w-80 flex flex-col space-y-4">
          <ErrorBoundary>{sidebar}</ErrorBoundary>
        </div>
      </div>
    </div>
  );
}