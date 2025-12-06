import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { Loader2 } from 'lucide-react';

// Lazy Load Pages for Performance Optimization
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Chat = lazy(() => import('./pages/Chat'));
const ImageGenerator = lazy(() => import('./pages/ImageGenerator'));
const History = lazy(() => import('./pages/History'));
const PhotoStudio = lazy(() => import('./pages/PhotoStudio'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="flex h-[80vh] w-full items-center justify-center">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-neon-blue" />
      <span className="text-sm font-medium text-gray-500">Sabar Bro...</span>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/image" element={<ImageGenerator />} />
            <Route path="/photo-studio" element={<PhotoStudio />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;