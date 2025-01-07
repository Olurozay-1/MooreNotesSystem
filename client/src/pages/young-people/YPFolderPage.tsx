import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { FileUp, Filter } from "lucide-react";
import { useParams } from "wouter";
import { useState } from "react";

const documentCategories = [
  "Health & Wellbeing",
  "Financial",
  "Agreements",
  "Education",
  "Care Plans",
  "Risk Assessments"
] as const;

type DocumentCategory = typeof documentCategories[number];

export default function YPFolderPage() {
  const { id } = useParams<{ id: string }>();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | "all">("all");
  const { toast } = useToast();
  const form = useForm();

  // Fetch young person's details
  const { data: person } = useQuery({
    queryKey: [`/api/young-people/${id}`],
    enabled: !!id
  });

  // Fetch documents
  const { data: documents, isLoading } = useQuery({
    queryKey: [`/api/yp-folder/${id}/documents`],
    enabled: !!id
  });

  const filteredDocuments = documents?.filter(doc => 
    selectedCategory === "all" || doc.category === selectedCategory
  );

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('file', data.file[0]);
      formData.append('title', data.title);
      formData.append('category', data.category);

      const response = await fetch(`/api/yp-folder/${id}/documents`, {
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
      setIsUploadOpen(false);
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{person?.name}'s YP Folder</h1>
        <Button onClick={() => setIsUploadOpen(true)}>
          <FileUp className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Filter className="h-5 w-5" />
        <Select value={selectedCategory} onValueChange={(value: DocumentCategory | "all") => setSelectedCategory(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {documentCategories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3">Loading documents...</div>
        ) : !filteredDocuments?.length ? (
          <div className="col-span-3">No documents found</div>
        ) : filteredDocuments?.map((doc: any) => (
          <Card key={doc.id}>
            <CardHeader>
              <CardTitle className="text-lg">{doc.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Category: {doc.category}
              </p>
              <p className="text-sm text-muted-foreground">
                Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <a href={doc.path} target="_blank" rel="noopener noreferrer">
                  View Document
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Title</label>
                <Input {...form.register('title')} required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  onValueChange={(value) => form.setValue('category', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Document File</label>
                <Input 
                  type="file" 
                  {...form.register('file')} 
                  required
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Upload</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
