
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function ShiftLogsPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [datetime, setDatetime] = useState("");
  const [shift, setShift] = useState("");
  const [logType, setLogType] = useState("");
  const [description, setDescription] = useState("");
  const [concerns, setConcerns] = useState("");

  const { data: logs, isLoading } = useQuery({
    queryKey: ['/api/shift-logs', id],
    queryFn: async () => {
      const response = await fetch(`/api/shift-logs/${id}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      return response.json();
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/shift-logs/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to create log');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Log created successfully" });
      setDatetime("");
      setShift("");
      setLogType("");
      setDescription("");
      setConcerns("");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({
      datetime,
      shift,
      logType,
      description,
      concerns
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Shift Logs</h1>

      <Card>
        <CardHeader>
          <CardTitle>New Log Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date & Time</label>
              <Input
                type="datetime-local"
                value={datetime}
                onChange={e => setDatetime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Shift</label>
              <Select value={shift} onValueChange={setShift} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select shift..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Log Type</label>
              <Select value={logType} onValueChange={setLogType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select log type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Log</SelectItem>
                  <SelectItem value="grumbles">Grumbles Log</SelectItem>
                  <SelectItem value="takeaway">Takeaway Log</SelectItem>
                  <SelectItem value="missing">Reported Missing</SelectItem>
                  <SelectItem value="found">Found</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Concerns (Optional)</label>
              <Textarea
                value={concerns}
                onChange={e => setConcerns(e.target.value)}
              />
            </div>

            <Button type="submit">Submit Log</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Logs</h2>
        {isLoading ? (
          <p>Loading logs...</p>
        ) : !logs?.length ? (
          <p>No logs found</p>
        ) : (
          <div className="space-y-4">
            {logs.map((log: any) => (
              <Card key={log.id}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="font-medium">{new Date(log.datetime).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground capitalize">{log.shift} Shift</p>
                    </div>
                    <p className="text-sm text-blue-600 font-medium capitalize">{log.logType.replace('_', ' ')}</p>
                    <p className="text-sm mt-2">{log.description}</p>
                    {log.concerns && (
                      <p className="text-sm text-red-600 mt-2">Concerns: {log.concerns}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
