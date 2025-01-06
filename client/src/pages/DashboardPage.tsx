import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Calendar, CheckCircle2, Clock } from "lucide-react";

export default function DashboardPage() {
  const { toast } = useToast();
  const form = useForm();
  
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/tasks'],
  });

  const onSubmitTask = async (data: any) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      toast({
        title: "Success",
        description: "Task created successfully",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily Tasks</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Tasks</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Tasks</TabsTrigger>
          <TabsTrigger value="handover">Handover</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Daily Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <div>Loading tasks...</div>
              ) : (
                <div className="space-y-4">
                  {tasks?.filter((task: any) => task.frequency === 'daily').map((task: any) => (
                    <div key={task.id} className="flex items-center gap-2 p-2 border rounded">
                      <CheckCircle2 className={`h-5 w-5 ${task.completed ? 'text-green-500' : 'text-gray-300'}`} />
                      <span>{task.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitTask)} className="space-y-4">
                  <div>
                    <Input {...form.register('title')} placeholder="Task title" />
                  </div>
                  <div>
                    <Textarea {...form.register('description')} placeholder="Task description" />
                  </div>
                  <Button type="submit">Add Task</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <div>Loading tasks...</div>
              ) : (
                <div className="space-y-4">
                  {tasks?.filter((task: any) => task.frequency === 'weekly').map((task: any) => (
                    <div key={task.id} className="flex items-center gap-2 p-2 border rounded">
                      <CheckCircle2 className={`h-5 w-5 ${task.completed ? 'text-green-500' : 'text-gray-300'}`} />
                      <span>{task.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Monthly Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <div>Loading tasks...</div>
              ) : (
                <div className="space-y-4">
                  {tasks?.filter((task: any) => task.frequency === 'monthly').map((task: any) => (
                    <div key={task.id} className="flex items-center gap-2 p-2 border rounded">
                      <CheckCircle2 className={`h-5 w-5 ${task.completed ? 'text-green-500' : 'text-gray-300'}`} />
                      <span>{task.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="handover">
          <Card>
            <CardHeader>
              <CardTitle>Handover Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-4">
                  <Textarea 
                    placeholder="Enter handover notes for the next shift"
                    className="min-h-[200px]"
                  />
                  <Button type="submit">Save Handover Notes</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
