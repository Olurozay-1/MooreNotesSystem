import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const shiftLogFormSchema = z.object({
  shiftDate: z.string().nonempty("Date & time is required"),
  shiftType: z.enum(["Morning", "Afternoon", "Night"], {
    required_error: "Please select a shift type",
  }),
  logType: z.enum(["Daily Log", "Grumbles log", "Takeaway Log", "Reported Missing", "Found"], {
    required_error: "Please select a log type",
  }),
  content: z.string().min(10, "Log description must be at least 10 characters"),
  concerns: z.string().optional(),
});

type ShiftLogFormValues = z.infer<typeof shiftLogFormSchema>;

export default function ShiftLogsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const params = new URLSearchParams(window.location.search);
  const residentId = params.get('id');

  const { data: resident } = useQuery({
    queryKey: ['/api/young-people', residentId],
    queryFn: async () => {
      if (!residentId) return null;
      const res = await fetch(`/api/young-people/${residentId}`);
      return res.json();
    },
    enabled: !!residentId
  });
  
  const form = useForm<ShiftLogFormValues>({
    resolver: zodResolver(shiftLogFormSchema),
    defaultValues: {
      shiftDate: new Date().toISOString().slice(0, 16),
      content: "",
      concerns: "",
    },
  });

  const { data: recentLogs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ["/api/shift-logs"],
  });

  const createLog = useMutation({
    mutationFn: async (values: ShiftLogFormValues) => {
      const res = await fetch("/api/shift-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shift-logs"] });
      toast({
        title: "Success",
        description: "Shift log has been created",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: ShiftLogFormValues) {
    createLog.mutate(values);
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">
        {resident ? `Shift Logs - ${resident.name}` : 'Shift Logs'}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Create Shift Log</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="shiftDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        <Input type="datetime-local" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="shiftType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Morning">Morning</SelectItem>
                        <SelectItem value="Afternoon">Afternoon</SelectItem>
                        <SelectItem value="Night">Night</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Log Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select log type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Daily Log">Daily Log</SelectItem>
                        <SelectItem value="Grumbles log">Grumbles log</SelectItem>
                        <SelectItem value="Takeaway Log">Takeaway Log</SelectItem>
                        <SelectItem value="Reported Missing">Reported Missing</SelectItem>
                        <SelectItem value="Found">Found</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Log Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter log description..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="concerns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Concerns</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any concerns..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={createLog.isPending}>
                {createLog.isPending ? "Submitting..." : "Submit Log"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Log Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingLogs ? (
            <p>Loading recent logs...</p>
          ) : recentLogs?.length === 0 ? (
            <p>No logs found</p>
          ) : (
            <div className="space-y-4">
              {recentLogs?.map((log: any) => (
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
    </div>
  );
}
