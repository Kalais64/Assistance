import React, { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function DashboardCard({ title, children, className = '' }: DashboardCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-600 to-indigo-700">
        <h3 className="text-lg font-medium leading-6 text-white">{title}</h3>
      </div>
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
}