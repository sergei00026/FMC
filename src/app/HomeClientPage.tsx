'use client';

import dynamic from 'next/dynamic';

const DashboardPage = dynamic(
  async () => {
    const dashboardModule = await import('@/widgets/dashboard/ui');
    return dashboardModule.DashboardPage;
  },
  { ssr: false },
);

export const HomeClientPage = () => {
  return <DashboardPage />;
};
