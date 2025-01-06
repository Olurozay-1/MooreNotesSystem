import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Lock, Shield } from "lucide-react";
import { useUser } from "@/hooks/use-user";

export default function BusinessVaultPage() {
  const { user } = useUser();
  const { toast } = useToast();

  const { data: documents, isLoading } = useQuery({
    queryKey: ['/api/documents/business'],
    enabled: user?.role === 'manager'
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

  if (user?.role !== 'manager') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Shield className="h-12 w-12 text-red-500 mx-auto" />
              <h1 className="text-2xl font-bold">Access Restricted</h1>
              <p className="text-gray-600">
                This area is only accessible to managers.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Business Vault</h1>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <span className="text-sm text-primary">Manager Access Only</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Secure Document</CardTitle>
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
              value="business"
            />
            <Button type="submit">Upload to Vault</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vault Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading secure documents...</div>
          ) : (
            <div className="space-y-4">
              {documents?.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded">
                  <div className="flex items-center gap-2">
                    <FileUp className="h-4 w-4" />
                    <div>
                      <h3 className="font-medium">{doc.title}</h3>
                      <p className="text-sm text-gray-600">
                        Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
