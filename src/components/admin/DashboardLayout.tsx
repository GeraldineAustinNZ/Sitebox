import { DashboardSidebar } from './DashboardSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-charcoal-50">
      <DashboardSidebar />
      <main className="flex-grow p-8">
        {children}
      </main>
    </div>
  );
}
