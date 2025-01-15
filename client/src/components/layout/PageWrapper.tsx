import { Sidebar } from "./Sidebar";
import { useLocation } from "wouter";

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const [location] = useLocation();

  // Function to get the current page title
  const getPageTitle = () => {
    const path = location.split("/")[1];
    if (!path) return "Dashboard";
    if (path === "hr") return "Human Resources";
    return path.split("-").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64 flex-shrink-0" />
      <div className="flex-1 flex flex-col bg-gray-100">
        <header className="h-16 bg-white border-b flex items-center px-8 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">
            {getPageTitle()}
          </h1>
        </header>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}