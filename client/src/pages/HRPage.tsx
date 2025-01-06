import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, FileUp, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

      <Tabs defaultValue="documents">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                HR Documents
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
                      <span>{doc.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timesheets">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Timesheet Upload
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
                  value="hr"
                />
                <Button type="submit">Upload Timesheet</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle>Policies & Procedures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded">
                  <h3 className="font-semibold">Employee Handbook</h3>
                  <p className="text-sm text-gray-600">Last updated: March 2024</p>
                  <Button variant="outline" className="mt-2">
                    <FileUp className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
                <div className="p-4 border rounded">
                  <h3 className="font-semibold">Health & Safety Policy</h3>
                  <p className="text-sm text-gray-600">Last updated: February 2024</p>
                  <Button variant="outline" className="mt-2">
                    <FileUp className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
