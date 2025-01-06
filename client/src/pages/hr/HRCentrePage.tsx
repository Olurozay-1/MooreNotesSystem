import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";

export default function HRCentrePage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const isManager = user?.role?.toLowerCase() === "manager";

  const { data: activities, isLoading } = useQuery({
    queryKey: ['/api/hr-activities'],
  });

  const { data: users } = useQuery({
    queryKey: ['/api/users'],
    enabled: isManager
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/hr-activities', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create HR activity');
      }

      toast({
        title: "Success",
        description: "HR activity created successfully",
      });

      // Invalidate and refetch HR activities
      queryClient.invalidateQueries({ queryKey: ['/api/hr-activities'] });

      setIsCreateOpen(false);
      event.currentTarget.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">HR Centre</h1>
        {isManager && (
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-[#1a73e8] hover:bg-[#1557b0]"
          >
            New HR Activity
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>HR Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Employee</th>
                  <th className="text-left py-3 px-4">Outcome</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Scheduled Date</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      Loading activities...
                    </td>
                  </tr>
                ) : !activities || activities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No HR activities found
                    </td>
                  </tr>
                ) : (
                  activities?.map((activity: any) => (
                    <tr key={activity.id} className="border-t">
                      <td className="py-3 px-4">{activity.type}</td>
                      <td className="py-3 px-4">{activity.employee?.username}</td>
                      <td className="py-3 px-4">{activity.outcome}</td>
                      <td className="py-3 px-4">{activity.status}</td>
                      <td className="py-3 px-4">
                        {new Date(activity.scheduledDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">View</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create HR Activity</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4" encType="multipart/form-data">
            <div className="space-y-2">
              <label className="text-sm font-medium">Activity Type</label>
              <Select name="type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="probation_review">Probation Review</SelectItem>
                  <SelectItem value="disciplinary">Disciplinary</SelectItem>
                  <SelectItem value="supervision">Supervision</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Employee</label>
              <Select name="employeeId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((user: any) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Outcome</label>
              <Input 
                name="outcome"
                placeholder="Activity outcome"
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                name="description"
                placeholder="Additional details"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Scheduled Date</label>
              <Input 
                name="scheduledDate"
                type="date"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Document (Optional)</label>
              <Input 
                type="file" 
                name="document" 
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Activity</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}