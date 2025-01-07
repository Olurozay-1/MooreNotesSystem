import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  Phone, Mail, School, User2, Heart, Shield, 
  Calendar, Home, FileText, AlertTriangle, Pencil, Plus
} from "lucide-react";
import { useUser } from "@/hooks/use-user";
import type { YoungPerson, ShiftLog } from "@db/schema";

type EditSectionType = 'key' | 'contacts' | 'health' | 'safeguarding' | 'education' | null;

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [editSection, setEditSection] = useState<EditSectionType>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const form = useForm<Partial<YoungPerson>>();

  // Fetch young person's details
  const { data: person, isLoading: isLoadingPerson } = useQuery<YoungPerson>({
    queryKey: [`/api/young-people/${id}`],
    enabled: !!id
  });

  // Fetch recent shift logs
  const { data: shiftLogs, isLoading: isLoadingLogs } = useQuery<ShiftLog[]>({
    queryKey: [`/api/shift-logs`],
  });

  const updateProfile = useMutation({
    mutationFn: async (data: Partial<YoungPerson>) => {
      const res = await fetch(`/api/young-people/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/young-people/${id}`] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setEditSection(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  if (isLoadingPerson) {
    return <div>Loading profile...</div>;
  }

  if (!person) {
    return <div>Person not found</div>;
  }

  const recentLogs = shiftLogs?.slice(0, 5) || [];

  const handleSubmit = (data: Partial<YoungPerson>) => {
    updateProfile.mutate(data);
  };

  const renderEditFields = () => {
    switch (editSection) {
      case 'key':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input {...form.register('name')} defaultValue={person.name} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date of Birth</label>
              <Input {...form.register('dateOfBirth')} type="date" 
                defaultValue={person.dateOfBirth ? new Date(person.dateOfBirth).toISOString().split('T')[0] : ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Room Number</label>
              <Input {...form.register('roomNumber')} defaultValue={person.roomNumber || ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input {...form.register('phoneNumber')} defaultValue={person.phoneNumber || ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Local Authority</label>
              <Input {...form.register('localAuthority')} defaultValue={person.localAuthority || ''} />
            </div>
          </>
        );
      case 'contacts':
        return (
          <>
            <div className="space-y-4">
              <h3 className="font-semibold">Next of Kin</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input {...form.register('nextOfKinName')} defaultValue={person.nextOfKinName || ''} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input {...form.register('nextOfKinPhone')} defaultValue={person.nextOfKinPhone || ''} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input {...form.register('nextOfKinEmail')} type="email" defaultValue={person.nextOfKinEmail || ''} />
              </div>
            </div>
            <div className="space-y-4 mt-6">
              <h3 className="font-semibold">Social Worker</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input {...form.register('socialWorkerName')} defaultValue={person.socialWorkerName || ''} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input {...form.register('socialWorkerPhone')} defaultValue={person.socialWorkerPhone || ''} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input {...form.register('socialWorkerEmail')} type="email" defaultValue={person.socialWorkerEmail || ''} />
              </div>
            </div>
          </>
        );
      case 'health':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Allergies</label>
              <Textarea {...form.register('allergies')} defaultValue={person.allergies || ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Medical Conditions</label>
              <Textarea {...form.register('conditions')} defaultValue={person.conditions || ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Medications</label>
              <Textarea {...form.register('medications')} defaultValue={person.medications || ''} />
            </div>
          </>
        );
      case 'safeguarding':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Recent Incidents</label>
              <Textarea {...form.register('notes')} defaultValue={person.notes || ''} placeholder="Enter recent incidents" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Missing Person Reports</label>
              <Textarea {...form.register('notes')} defaultValue={person.notes || ''} placeholder="Enter missing person reports" />
            </div>
          </>
        );
      case 'education':
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">School Name</label>
              <Input {...form.register('schoolName')} defaultValue={person.schoolName || ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Name</label>
              <Input {...form.register('schoolContact')} defaultValue={person.schoolContact || ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input {...form.register('schoolPhone')} defaultValue={person.schoolPhone || ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input {...form.register('schoolEmail')} type="email" defaultValue={person.schoolEmail || ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Attendance Days</label>
              <Input {...form.register('schoolDays')} defaultValue={person.schoolDays || ''} />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">{person.name}'s Profile</h1>

      {/* Key Information - Full Width */}
      <Card className="w-full relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setEditSection('key')}
          className="absolute top-4 right-4"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User2 className="h-5 w-5" />
            Key Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Full Name</p>
            <p className="text-lg">{person.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
            <p className="text-lg">
              {person.dateOfBirth ? format(new Date(person.dateOfBirth), 'PPP') : 'Not specified'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Age</p>
            <p className="text-lg">
              {person.dateOfBirth
                ? Math.floor((new Date().getTime() - new Date(person.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
                : 'Not specified'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Local Authority</p>
            <p className="text-lg">{person.localAuthority || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Room Number</p>
            <p className="text-lg">{person.roomNumber || 'Not assigned'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
            <p className="text-lg">{person.phoneNumber || 'Not specified'}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* Primary Contacts */}
        <Card className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditSection('contacts')}
            className="absolute top-4 right-4"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Primary Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Next of Kin</h3>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-medium">Name:</span> {person.nextOfKinName || 'Not specified'}</p>
                <p className="text-sm"><span className="font-medium">Phone:</span> {person.nextOfKinPhone || 'Not specified'}</p>
                <p className="text-sm"><span className="font-medium">Email:</span> {person.nextOfKinEmail || 'Not specified'}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Social Worker</h3>
              <div className="space-y-2">
                <p className="text-sm"><span className="font-medium">Name:</span> {person.socialWorkerName || 'Not specified'}</p>
                <p className="text-sm"><span className="font-medium">Phone:</span> {person.socialWorkerPhone || 'Not specified'}</p>
                <p className="text-sm"><span className="font-medium">Email:</span> {person.socialWorkerEmail || 'Not specified'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health & Wellbeing */}
        <Card className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditSection('health')}
            className="absolute top-4 right-4"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Health & Wellbeing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Allergies</h3>
              <p className="text-sm">{person.allergies || 'None reported'}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Medical Conditions</h3>
              <p className="text-sm">{person.conditions || 'None reported'}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Medications</h3>
              <p className="text-sm">{person.medications || 'None prescribed'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Safeguarding */}
        <Card className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditSection('safeguarding')}
            className="absolute top-4 right-4"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Safeguarding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Recent Incidents</h3>
                <p className="text-sm text-muted-foreground">No recent incidents reported</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Missing Person Reports</h3>
                <p className="text-sm text-muted-foreground">No missing person reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditSection('education')}
            className="absolute top-4 right-4"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">School Details</h3>
              <p className="text-sm"><span className="font-medium">Name:</span> {person.schoolName || 'Not specified'}</p>
              <p className="text-sm"><span className="font-medium">Contact:</span> {person.schoolContact || 'Not specified'}</p>
              <p className="text-sm"><span className="font-medium">Phone:</span> {person.schoolPhone || 'Not specified'}</p>
              <p className="text-sm"><span className="font-medium">Email:</span> {person.schoolEmail || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Attendance Days</h3>
              <p className="text-sm">{person.schoolDays || 'Not specified'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Shift Logs - Full Width */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Shift Logs
          </CardTitle>
          <Link href={`/young-people/shift-logs?id=${id}`}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Log
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoadingLogs ? (
            <p>Loading shift logs...</p>
          ) : recentLogs.length === 0 ? (
            <p>No recent shift logs</p>
          ) : (
            <div className="space-y-4">
              {recentLogs.map((log: ShiftLog) => (
                <Card key={log.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{log.logType}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(log.shiftDate), "PPpp")} - {log.shiftType} Shift
                        </p>
                      </div>
                    </div>
                    <p className="mt-2">{log.content}</p>
                    {log.concerns && (
                      <div className="mt-4 p-4 bg-muted rounded-md">
                        <p className="font-semibold">Concerns:</p>
                        <p>{log.concerns}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editSection} onOpenChange={() => setEditSection(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit {editSection === 'key' ? 'Key Information' :
                    editSection === 'contacts' ? 'Primary Contacts' :
                    editSection === 'health' ? 'Health & Wellbeing' :
                    editSection === 'safeguarding' ? 'Safeguarding' :
                    editSection === 'education' ? 'Education' : ''
              }
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {renderEditFields()}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditSection(null)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}