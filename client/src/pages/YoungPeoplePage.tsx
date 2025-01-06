import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Plus, Folder, ClipboardList, User2 } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export default function YoungPeoplePage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const isManager = user?.role?.toLowerCase() === "manager";

  const { data: youngPeople, isLoading } = useQuery({
    queryKey: ['/api/young-people'],
  });

  const form = useForm();

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/young-people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to create record');
      }

      toast({
        title: "Success",
        description: "Record created successfully",
      });
      setIsCreateOpen(false);
      form.reset();
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
        <h1 className="text-2xl font-bold">Young People</h1>
        {isManager && (
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-[#1a73e8] hover:bg-[#1557b0]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Resident
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p>Loading residents...</p>
        ) : youngPeople?.map((person: any) => (
          <Card key={person.id} className="hover:bg-accent transition-colors">
            <CardHeader>
              <CardTitle>{person.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  DOB: {new Date(person.dateOfBirth).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Link href={`/young-people/${person.id}/folder`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Folder className="h-4 w-4" />
                      YP Folder
                    </Button>
                  </Link>
                  <Link href={`/young-people/${person.id}/logs`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Shift Logs
                    </Button>
                  </Link>
                  <Link href={`/young-people/${person.id}/profile`}>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <User2 className="h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Resident</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input {...form.register('name')} required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date of Birth</label>
                <Input {...form.register('dateOfBirth')} type="date" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Gender</label>
                <Input {...form.register('gender')} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Admitted</label>
                <Input {...form.register('dateAdmitted')} type="date" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Care Status</label>
                <Input {...form.register('careStatus')} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Social Worker</label>
                <Input {...form.register('socialWorker')} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Local Authority</label>
                <Input {...form.register('localAuthority')} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Allergies</label>
                <Input {...form.register('allergies')} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Dietary Requirements</label>
                <Input {...form.register('dietaryRequirements')} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Notes</label>
                <Textarea {...form.register('notes')} />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Resident</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}