import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Lock, Users, Clock, Building } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Document {
  id: string;
  title: string;
  createdAt: string;
  type: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Timesheet {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  status: string;
  submittedAt: string;
}

export default function BusinessVaultPage() {
  const { user } = useUser();
  const { toast } = useToast();

  const { data: documents = [], isLoading: isLoadingDocuments } = useQuery<Document[]>({
    queryKey: ['/api/documents/business'],
    enabled: user?.role?.toLowerCase() === 'manager'
  });

  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery<Employee[]>({
    queryKey: ['/api/employees'],
    enabled: user?.role?.toLowerCase() === 'manager'
  });

  const { data: timesheets = [], isLoading: isLoadingTimesheets } = useQuery<Timesheet[]>({
    queryKey: ['/api/timesheets/all'],
    enabled: user?.role?.toLowerCase() === 'manager'
  });

  const onUploadDocument = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      event.target.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
    }
  };

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

      <Tabs defaultValue="documents">
        <TabsList className="w-full">
          <TabsTrigger value="documents" className="flex-1">
            <Building className="h-4 w-4 mr-2" />
            Smock Walk Documents
          </TabsTrigger>
          <TabsTrigger value="employees" className="flex-1">
            <Users className="h-4 w-4 mr-2" />
            Employees
          </TabsTrigger>
          <TabsTrigger value="timesheets" className="flex-1">
            <Clock className="h-4 w-4 mr-2" />
            Timesheets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Secure Document</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onUploadDocument} className="space-y-4">
                <Input type="file" name="file" required />
                <Input 
                  type="text" 
                  name="title" 
                  placeholder="Document title"
                  required
                />
                <Input 
                  type="hidden" 
                  name="type" 
                  value="business"
                />
                <Button type="submit">Upload to Vault</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vault Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingDocuments ? (
                <div>Loading secure documents...</div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded">
                      <div className="flex items-center gap-2">
                        <FileUp className="h-4 w-4" />
                        <div>
                          <h3 className="font-medium">{doc.title}</h3>
                          <p className="text-sm text-gray-600">
                            Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingEmployees ? (
                <div>Loading employees...</div>
              ) : (
                <div className="space-y-4">
                  {employees.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-4 border rounded">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <div>
                          <h3 className="font-medium">{employee.name}</h3>
                          <p className="text-sm text-gray-600">
                            {employee.email} • {employee.role}
                          </p>
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm">View Profile</Button>
                        <Button variant="outline" size="sm">Documents</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timesheets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submitted Timesheets</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingTimesheets ? (
                <div>Loading timesheets...</div>
              ) : (
                <div className="space-y-4">
                  {timesheets.map((timesheet) => (
                    <div key={timesheet.id} className="flex items-center justify-between p-4 border rounded">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <div>
                          <h3 className="font-medium">{timesheet.employeeName}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(timesheet.startDate).toLocaleDateString()} - {new Date(timesheet.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Status: {timesheet.status}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}