import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// Layout & Components
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import CrisisModal from './components/CrisisModal';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import MemoriesPage from './pages/MemoriesPage';
import GoalsPage from './pages/GoalsPage';
import CheckInPage from './pages/CheckInPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const { init } = useAuthStore();
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            fontSize: '13px',
            borderRadius: '12px',
          },
        }}
      />

      {/* Routes */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Routes>
          {/* Public Pages */}
          <Route
            path="/"
            element={<LandingPage onOpenCrisisModal={() => setIsCrisisModalOpen(true)} />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Onboarding */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Authenticated Pages with Shared Sidebar Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout onOpenCrisisModal={() => setIsCrisisModalOpen(true)}>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <AppLayout onOpenCrisisModal={() => setIsCrisisModalOpen(true)}>
                  <ChatPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:id"
            element={
              <ProtectedRoute>
                <AppLayout onOpenCrisisModal={() => setIsCrisisModalOpen(true)}>
                  <ChatPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/memories"
            element={
              <ProtectedRoute>
                <AppLayout onOpenCrisisModal={() => setIsCrisisModalOpen(true)}>
                  <MemoriesPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <AppLayout onOpenCrisisModal={() => setIsCrisisModalOpen(true)}>
                  <GoalsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkins"
            element={
              <ProtectedRoute>
                <AppLayout onOpenCrisisModal={() => setIsCrisisModalOpen(true)}>
                  <CheckInPage onOpenCrisisModal={() => setIsCrisisModalOpen(true)} />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppLayout onOpenCrisisModal={() => setIsCrisisModalOpen(true)}>
                  <ProfilePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Emergency Crisis Helpline Modal */}
      <CrisisModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />
    </div>
  );
}
