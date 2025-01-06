
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileUp, File } from "lucide-react";

export default function DocumentsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const { data: documents, isLoading } = useQuery({
    queryKey: ['/api/documents/hr'],
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
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
      setIsOpen(false);
      event.currentTarget.reset();
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">HR Documents</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add New Document</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
              <Input
                name="title"
                placeholder="Document Name"
                required
              />
              <Select name="type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onboarding">Onboarding Document</SelectItem>
                  <SelectItem value="compliance">Compliance Document</SelectItem>
                  <SelectItem value="training">Training Document</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                name="reviewDate"
                placeholder="Review Date (Optional)"
              />
              <Textarea
                name="notes"
                placeholder="Notes"
              />
              <Input
                type="file"
                name="file"
                required
              />
              <Button type="submit" className="w-full">
                Upload Document
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading documents...</div>
          ) : (
            <div className="space-y-4">
              {documents?.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4" />
                    <div>
                      <h3 className="font-medium">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Type: {doc.type} {doc.reviewDate && `| Review: ${new Date(doc.reviewDate).toLocaleDateString()}`}
                      </p>
                      {doc.notes && <p className="text-sm mt-1">{doc.notes}</p>}
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => window.open(`/${doc.path}`)}>
                    View
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
