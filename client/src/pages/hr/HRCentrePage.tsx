
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HRCentrePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Briefcase className="h-6 w-6" />
        <h1 className="text-2xl font-bold">HR Centre</h1>
      </div>
      <p className="text-muted-foreground">
        Access and manage key HR functions, including employee records, performance management, and recruitment processes.
      </p>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Employee Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <ClipboardList className="mr-2 h-4 w-4" />
              Disciplinaries
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <ClipboardList className="mr-2 h-4 w-4" />
              Probation Reviews
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <ClipboardList className="mr-2 h-4 w-4" />
              Supervisions
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <ClipboardList className="mr-2 h-4 w-4" />
              Meetings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
