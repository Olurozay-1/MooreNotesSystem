
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Clock, Moon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";

export default function TimesheetsPage() {
  const [date, setDate] = useState<Date>();
  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [isSleepIn, setIsSleepIn] = useState(false);
  const [notes, setNotes] = useState("");
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: timesheets } = useQuery({
    queryKey: ["timesheets"],
    queryFn: () => fetch("/api/timesheets").then(res => res.json())
  });

  const submitMutation = useMutation({
    mutationFn: (data: any) => 
      fetch("/api/timesheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timesheets"] });
      toast({ title: "Success", description: "Timesheet submitted successfully" });
      setDate(undefined);
      setTimeIn("");
      setTimeOut("");
      setIsSleepIn(false);
      setNotes("");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !timeIn || !timeOut) {
      return toast({ 
        title: "Error", 
        description: "Please fill in all required fields",
        variant: "destructive"
      });
    }

    submitMutation.mutate({
      shiftDate: date,
      timeIn: `${date.toISOString().split('T')[0]}T${timeIn}:00`,
      timeOut: `${date.toISOString().split('T')[0]}T${timeOut}:00`,
      isSleepIn,
      notes
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Timesheets</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Record New Shift</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label>Shift Date</label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>

              <div className="flex items-center gap-4">
                <label>Sleep-in Shift</label>
                <Switch 
                  checked={isSleepIn} 
                  onCheckedChange={setIsSleepIn} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label>Time In</label>
                  <Input 
                    type="time" 
                    value={timeIn}
                    onChange={e => setTimeIn(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label>Time Out</label>
                  <Input 
                    type="time"
                    value={timeOut}
                    onChange={e => setTimeOut(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label>Notes (Optional)</label>
                <Textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Add any notes about this shift..."
                />
              </div>

              <Button type="submit" className="w-full">
                Record Shift
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shifts Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            {!timesheets?.length ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Clock className="h-12 w-12 mb-4" />
                <p>No shifts recorded</p>
                <p className="text-sm">Start by recording your first shift using the form</p>
              </div>
            ) : (
              <div className="space-y-4">
                {timesheets.map((timesheet: any) => (
                  <div key={timesheet.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {new Date(timesheet.shiftDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(timesheet.timeIn).toLocaleTimeString()} - 
                        {new Date(timesheet.timeOut).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Statistics</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold">
                    {timesheets?.reduce((total, t) => {
                      const start = new Date(t.timeIn);
                      const end = new Date(t.timeOut);
                      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                      return total + hours;
                    }, 0).toFixed(1)}h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Sleep-ins</p>
                  <p className="text-2xl font-bold">
                    {timesheets?.filter(t => t.isSleepIn).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
