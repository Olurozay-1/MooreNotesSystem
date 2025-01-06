import { Switch, Route } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import AuthPage from "./pages/AuthPage";
import { PageWrapper } from "./components/layout/PageWrapper";
import { useUser } from "./hooks/use-user";

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
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/young-people" component={YoungPeoplePage} />
        <Route path="/hr" component={HRPage} />
        <Route path="/business-vault" component={BusinessVaultPage} />
        <Route component={NotFound} />
      </Switch>
    </PageWrapper>
  );
}

function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {/* Dashboard content */}
    </div>
  );
}

function YoungPeoplePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Young People</h1>
      {/* Young People content */}
    </div>
  );
}

function HRPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">HR</h1>
      {/* HR content */}
    </div>
  );
}

function BusinessVaultPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Business Vault</h1>
      {/* Business Vault content */}
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
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
