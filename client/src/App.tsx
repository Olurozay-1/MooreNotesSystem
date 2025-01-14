import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import AuthPage from "./pages/AuthPage";
import { PageWrapper } from "./components/layout/PageWrapper";
import { useUser } from "./hooks/use-user";
import DashboardPage from "./pages/DashboardPage";
import SmockWalkPage from "./pages/SmockWalkPage";
import YoungPeoplePage from "./pages/YoungPeoplePage";
import HRPage from "./pages/HRPage";
import BusinessVaultPage from "./pages/BusinessVaultPage";

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <PageWrapper>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/smock-walk" component={SmockWalkPage} />
        <Route path="/young-people" component={YoungPeoplePage} />
        <Route path="/young-people/:id/folder" component={lazy(() => import('./pages/young-people/YPFolderPage'))} />
        <Route path="/young-people/:id/profile" component={lazy(() => import('./pages/young-people/ProfilePage'))} />
        <Route path="/young-people/shift-logs" component={lazy(() => import('./pages/young-people/ShiftLogsPage'))} />
        <Route path="/hr" component={HRPage} />
        <Route path="/hr/centre" component={lazy(() => import('./pages/hr/HRCentrePage'))} />
        <Route path="/hr/timesheets" component={lazy(() => import('./pages/hr/TimesheetsPage'))} />
        <Route path="/hr/policies" component={lazy(() => import('./pages/hr/PoliciesPage'))} />
        <Route path="/hr/documents" component={lazy(() => import('./pages/hr/DocumentsPage'))} />
        <Route path="/business-vault" component={BusinessVaultPage} />
        <Route path="/business-vault/documents" component={lazy(() => import('./pages/business-vault/DocumentsPage'))} />
        <Route path="/business-vault/employees" component={lazy(() => import('./pages/business-vault/EmployeesPage'))} />
        <Route path="/business-vault/timesheets" component={lazy(() => import('./pages/business-vault/TimesheetsPage'))} />
        <Route path="/help-support" component={lazy(() => import('./pages/HelpSupportPage'))} />
        <Route component={NotFound} />
      </Switch>
      </Suspense>
    </PageWrapper>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold">404 Page Not Found</h1>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            The page you are looking for doesn't exist.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;