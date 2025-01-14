import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";

interface Timesheet {
  id: number;
  userId: number;
  shiftDate: string;
  timeIn: string;
  timeOut: string;
  isSleepIn: boolean;
  notes: string | null;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function TimesheetsPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: timesheets = [], isLoading, error } = useQuery<Timesheet[]>({
    queryKey: ['/api/timesheets'],
    enabled: user?.role?.toLowerCase() === 'manager'
  });

  const updateTimesheet = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'approved' | 'rejected' }) => {
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
      queryClient.invalidateQueries({ queryKey: ['/api/timesheets'] });
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

  const handleApprove = (id: number) => {
    updateTimesheet.mutate({ id, status: 'approved' });
  };

  const handleReject = (id: number) => {
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
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">
              Failed to load timesheets. Please try again later.
            </div>
          ) : timesheets.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No timesheets found.
            </div>
          ) : (
            <div className="space-y-4">
              {timesheets.map((timesheet) => (
                <div key={timesheet.id} className="flex items-center justify-between p-4 border rounded">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <div>
                      <h3 className="font-medium">Timesheet #{timesheet.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        Date: {new Date(timesheet.shiftDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Time: {new Date(timesheet.timeIn).toLocaleTimeString()} - {new Date(timesheet.timeOut).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Status: <span className={`font-medium ${
                          timesheet.status === 'approved' ? 'text-green-600' :
                          timesheet.status === 'rejected' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>{timesheet.status}</span>
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
                          disabled={updateTimesheet.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReject(timesheet.id)}
                          className="text-red-600 hover:text-red-700"
                          disabled={updateTimesheet.isPending}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
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