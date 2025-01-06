
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TimesheetsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Timesheets</h1>
      </div>
      <p className="text-muted-foreground">
        Manage and submit employee timesheets, track hours worked, and process payroll information.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Submit Timesheet</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input type="file" />
            <Input 
              type="text" 
              placeholder="Timesheet title (e.g. March 2024)" 
            />
            <Button type="submit">Upload Timesheet</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
