'use client';

import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

const DashboardLayout = ({ children, className = '' }: DashboardLayoutProps) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-navy-950 to-slate-900 ${className}`}>
      {children}
    </div>
  );
};

export default DashboardLayout;
