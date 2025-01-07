import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Phone, Mail, School, User2, Heart, Shield, 
  Calendar, Home, FileText, AlertTriangle 
} from "lucide-react";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();

  // Fetch young person's details
  const { data: person, isLoading: isLoadingPerson } = useQuery({
    queryKey: [`/api/young-people/${id}`],
    enabled: !!id
  });

  // Fetch recent shift logs
  const { data: shiftLogs, isLoading: isLoadingLogs } = useQuery({
    queryKey: [`/api/shift-logs`],
  });

  if (isLoadingPerson) {
    return <div>Loading profile...</div>;
  }

  if (!person) {
    return <div>Person not found</div>;
  }

  const recentLogs = shiftLogs?.slice(0, 5) || [];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold mb-8">{person.name}'s Profile</h1>

      {/* Key Information - Full Width */}
      <Card className="w-full">
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
        <Card>
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
        <Card>
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
        <Card>
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
        <Card>
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Shift Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingLogs ? (
            <p>Loading shift logs...</p>
          ) : recentLogs.length === 0 ? (
            <p>No recent shift logs</p>
          ) : (
            <div className="space-y-4">
              {recentLogs.map((log: any) => (
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
                        <p className="font-semibold text-warning">Concerns:</p>
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
    </div>
  );
}
