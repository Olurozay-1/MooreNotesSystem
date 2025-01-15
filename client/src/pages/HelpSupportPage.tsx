import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HelpCircle, Phone, Mail, Globe, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useUser } from "@/hooks/use-user";

interface HelpContact {
  id: number;
  name: string;
  role: string;
  phone: string;
  email?: string;
  website?: string;
}

export default function HelpSupportPage() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const isManager = user?.role?.toLowerCase() === "manager";

  // Fetch contacts
  const { data: contacts, isLoading } = useQuery<HelpContact[]>({
    queryKey: ["/api/help-support-contacts"],
  });

  // Add new contact mutation
  const addContact = useMutation({
    mutationFn: async (data: Omit<HelpContact, "id">) => {
      const response = await fetch("/api/help-support-contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to add contact");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/help-support-contacts"] });
      toast({
        title: "Success",
        description: "Contact added successfully",
      });
      setIsOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add contact",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    addContact.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Help & Support Contacts</h1>
        </div>
        {isManager && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = Object.fromEntries(formData.entries());
                onSubmit(data);
              }} className="space-y-4">
                <Input
                  name="name"
                  placeholder="Contact Name"
                  required
                />
                <Input
                  name="role"
                  placeholder="Role/Function"
                  required
                />
                <Input
                  name="phone"
                  placeholder="Phone Number"
                  required
                  type="tel"
                />
                <Input
                  name="email"
                  placeholder="Email Address"
                  type="email"
                />
                <Input
                  name="website"
                  placeholder="Website URL"
                  type="url"
                />
                <Button type="submit" className="w-full">
                  Add Contact
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div>Loading contacts...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts?.map((contact) => (
            <Card key={contact.id}>
              <CardHeader>
                <CardTitle>{contact.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{contact.role}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{contact.phone}</span>
                </div>
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${contact.email}`} className="hover:underline">
                      {contact.email}
                    </a>
                  </div>
                )}
                {contact.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a href={contact.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}