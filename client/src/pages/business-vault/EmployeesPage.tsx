import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { Link } from "wouter";

interface Employee {
  id: number;
  username: string;
  role: string;
}

export default function EmployeesPage() {
  const { user } = useUser();

  const { data: employees = [], isLoading } = useQuery<Employee[]>({
    queryKey: ['/api/users'],
    enabled: user?.role?.toLowerCase() === 'manager'
  });

  if (user?.role?.toLowerCase() !== 'manager') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Users className="h-12 w-12 text-red-500 mx-auto" />
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
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Employees</h1>
      </div>
      <p className="text-muted-foreground">
        View and manage employee information, access individual documents and HR records.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading employees...</div>
          ) : (
            <div className="space-y-4">
              {employees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-4 border rounded">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <div>
                      <h3 className="font-medium">{employee.username}</h3>
                      <p className="text-sm text-muted-foreground">
                        Role: {employee.role}
                      </p>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Link href={`/hr/centre/${employee.id}`}>
                      <Button variant="outline" size="sm">HR Profile</Button>
                    </Link>
                    <Link href={`/hr/documents/${employee.id}`}>
                      <Button variant="outline" size="sm">Documents</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}