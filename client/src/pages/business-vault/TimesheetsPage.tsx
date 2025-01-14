import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";

interface Timesheet {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  hours: number;
  submittedAt: string;
}

export default function TimesheetsPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: timesheets = [], isLoading } = useQuery<Timesheet[]>({
    queryKey: ['/api/timesheets/all'],
    enabled: user?.role?.toLowerCase() === 'manager'
  });

  const updateTimesheet = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
      const response = await fetch(`/api/timesheets/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to update timesheet');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/timesheets/all'] });
      toast({
        title: "Success",
        description: "Timesheet updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update timesheet",
        variant: "destructive",
      });
    },
  });

  if (user?.role?.toLowerCase() !== 'manager') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Clock className="h-12 w-12 text-red-500 mx-auto" />
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

  const handleApprove = (id: string) => {
    updateTimesheet.mutate({ id, status: 'approved' });
  };

  const handleReject = (id: string) => {
    updateTimesheet.mutate({ id, status: 'rejected' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Submitted Timesheets</h1>
      </div>
      <p className="text-muted-foreground">
        Review and sign off employee timesheets, track submissions and manage approvals.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Pending Timesheets</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading timesheets...</div>
          ) : (
            <div className="space-y-4">
              {timesheets.map((timesheet) => (
                <div key={timesheet.id} className="flex items-center justify-between p-4 border rounded">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <div>
                      <h3 className="font-medium">{timesheet.employeeName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(timesheet.startDate).toLocaleDateString()} - {new Date(timesheet.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Hours: {timesheet.hours} • Status: {timesheet.status}
                      </p>
                    </div>
                  </div>
                  <div className="space-x-2">
                    {timesheet.status === 'pending' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleApprove(timesheet.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReject(timesheet.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
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
