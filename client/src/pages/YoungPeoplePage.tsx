import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Users } from "lucide-react";

export default function YoungPeoplePage() {
  const { toast } = useToast();
  const form = useForm();

  const { data: youngPeople, isLoading: peopleLoading } = useQuery({
    queryKey: ['/api/young-people'],
  });

  const { data: documents, isLoading: docsLoading } = useQuery({
    queryKey: ['/api/documents/young_people'],
  });

  const onSubmitRecord = async (data: any) => {
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
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create record",
        variant: "destructive"
      });
    }
  };

  const onUploadDocument = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      event.target.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Young People</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {peopleLoading ? (
              <div>Loading records...</div>
            ) : (
              <div className="space-y-4">
                {youngPeople?.map((person: any) => (
                  <div key={person.id} className="p-4 border rounded">
                    <h3 className="font-semibold">{person.name}</h3>
                    <p className="text-sm text-gray-600">
                      DOB: {new Date(person.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onUploadDocument} className="space-y-4">
              <Input type="file" name="file" required />
              <Input 
                type="text" 
                name="title" 
                placeholder="Document title"
                required
              />
              <Input 
                type="hidden" 
                name="type" 
                value="young_people"
              />
              <Button type="submit">Upload Document</Button>
            </form>

            {docsLoading ? (
              <div>Loading documents...</div>
            ) : (
              <div className="mt-4 space-y-2">
                {documents?.map((doc: any) => (
                  <div key={doc.id} className="flex items-center gap-2 p-2 border rounded">
                    <FileUp className="h-4 w-4" />
                    <span>{doc.title}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Add New Record</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitRecord)} className="space-y-4">
                <Input {...form.register('name')} placeholder="Full name" required />
                <Input 
                  {...form.register('dateOfBirth')} 
                  type="date" 
                  required
                />
                <Textarea 
                  {...form.register('notes')} 
                  placeholder="Additional notes"
                />
                <Button type="submit">Add Record</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
