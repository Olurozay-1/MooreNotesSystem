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
import { FileUp, Building } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useState } from "react";

interface Document {
  id: string;
  title: string;
  category: string;
  reviewDate: string;
  createdAt: string;
}

const CATEGORIES = [
  "Insurance",
  "Finances",
  "Legal",
  "Home",
  "Other"
] as const;

export default function DocumentsPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
    enabled: user?.role?.toLowerCase() === 'manager'
  });

  const onUploadDocument = async (event: React.FormEvent<HTMLFormElement>) => {
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
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
    }
  };

  const filteredDocuments = selectedCategory
    ? documents.filter(doc => doc.category.toLowerCase() === selectedCategory.toLowerCase())
    : documents;

  if (user?.role?.toLowerCase() !== 'manager') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <FileUp className="h-12 w-12 text-red-500 mx-auto" />
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
      <div className="flex items-center gap-2">
        <Building className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Smock Walk Documents</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
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
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input 
              type="date" 
              name="reviewDate" 
              placeholder="Review date"
              required
            />
            <Button type="submit">Upload Document</Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category.toLowerCase()}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading documents...</div>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded">
                  <div className="flex items-center gap-2">
                    <FileUp className="h-4 w-4" />
                    <div>
                      <h3 className="font-medium">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Category: {doc.category}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Review Date: {new Date(doc.reviewDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}