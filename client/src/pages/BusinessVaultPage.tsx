import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Users, Clock, Lock } from "lucide-react";
import { Link } from "wouter";
import { useUser } from "@/hooks/use-user";

export default function BusinessVaultPage() {
  const { user } = useUser();

  if (user?.role?.toLowerCase() !== 'manager') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Lock className="h-12 w-12 text-red-500 mx-auto" />
              <h1 className="text-2xl font-bold">Access Restricted</h1>
              <p className="text-gray-600">
                This area is only accessible to managers.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Business Vault</h1>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <span className="text-sm text-primary">Manager Access Only</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/business-vault/documents">
          <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Smock Walk Documents</h2>
              </div>
              <p className="text-muted-foreground">
                Manage and access important documents related to Smock Walk, including insurance, finances, and legal documentation.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/business-vault/employees">
          <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Employees</h2>
              </div>
              <p className="text-muted-foreground">
                View and manage employee information, access individual documents and HR records.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/business-vault/timesheets">
          <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Timesheets</h2>
              </div>
              <p className="text-muted-foreground">
                Review and sign off employee timesheets, track submissions and manage approvals.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}