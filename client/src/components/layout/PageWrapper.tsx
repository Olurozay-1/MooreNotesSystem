import { Sidebar } from "./Sidebar";

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64 flex-shrink-0" />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
