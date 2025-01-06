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
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";

export default function HRCentrePage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const { data: activities, isLoading } = useQuery({
    queryKey: ['/api/hr-activities'],
  });

  const { data: users } = useQuery({
    queryKey: ['/api/users'],
    enabled: user && user.role === 'manager'
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/hr-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to create HR activity');
      }

      toast({
        title: "Success",
        description: "HR activity created successfully",
      });
      setIsCreateOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create HR activity",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">HR Centre</h1>
        {user && user.role === 'manager' && (
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
                ) : activities?.length === 0 ? (
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
          <form onSubmit={onSubmit} className="space-y-4">
            <Select name="type" required>
              <SelectTrigger>
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="probation_review">Probation Review</SelectItem>
                <SelectItem value="disciplinary">Disciplinary</SelectItem>
                <SelectItem value="supervision">Supervision</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
              </SelectContent>
            </Select>

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

            <Input 
              name="outcome"
              placeholder="Outcome"
              required 
            />

            <Textarea 
              name="description"
              placeholder="Description"
            />

            <Input 
              name="scheduledDate"
              type="date"
              required
            />

            <Input 
              type="file" 
              name="document" 
            />

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