
import React, { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

const MainApp = lazy(() => import('./MainApp'));

const App: React.FC = () => {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-parsa-light-bg" role="status" aria-label="Loading application">
                <div className="text-lg font-semibold text-parsa-gray-600">درحال بارگذاری...</div>
            </div>
        }>
            <ErrorBoundary>
                <MainApp />
            </ErrorBoundary>
        </Suspense>
    );
};

export default App;
