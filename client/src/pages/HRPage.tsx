import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, FileUp, ClipboardList, Clock, Book } from "lucide-react";

export default function HRPage() {
  const { toast } = useToast();

  const { data: documents, isLoading } = useQuery({
    queryKey: ['/api/documents/hr'],
  });

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
      <h1 className="text-2xl font-bold">Human Resources</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HR Centre */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              HR Centre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
            </div>
          </CardContent>
        </Card>

        {/* Document Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5" />
              Document Upload
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
              <Select name="category" defaultValue="onboarding">
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onboarding">Onboarding Documents</SelectItem>
                  <SelectItem value="training">Training Documents</SelectItem>
                  <SelectItem value="other">Other Documents</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                type="hidden" 
                name="type" 
                value="hr"
              />
              <Button type="submit">Upload Document</Button>
            </form>

            {isLoading ? (
              <div>Loading documents...</div>
            ) : (
              <div className="mt-4 space-y-2">
                {documents?.map((doc: any) => (
                  <div key={doc.id} className="flex items-center gap-2 p-2 border rounded">
                    <FileUp className="h-4 w-4" />
                    <div>
                      <span>{doc.title}</span>
                      <p className="text-sm text-muted-foreground">
                        {doc.category || 'Uncategorized'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timesheets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timesheets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onUploadDocument} className="space-y-4">
              <Input type="file" name="file" required />
              <Input 
                type="text" 
                name="title" 
                placeholder="Timesheet title (e.g. March 2024)"
                required
              />
              <Input 
                type="hidden" 
                name="type" 
                value="timesheet"
              />
              <Button type="submit">Upload Timesheet</Button>
            </form>
          </CardContent>
        </Card>

        {/* Policies & Procedures */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Policies & Procedures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Employee Handbook</h3>
                    <p className="text-sm text-gray-600">Last updated: March 2024</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Mark as Read
                  </Button>
                </div>
              </div>
              <div className="p-4 border rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Health & Safety Policy</h3>
                    <p className="text-sm text-gray-600">Last updated: February 2024</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Mark as Read
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}