'use client';

import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DashboardLayout, 
  DashboardHeader, 
  TopItemsDisplay 
} from '../components/dashboard';

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <DashboardHeader 
        subtitle="Welcome back!"
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Music Section */}
        <TopItemsDisplay />
      </main>
    </DashboardLayout>
  );
};

export default Dashboard;
