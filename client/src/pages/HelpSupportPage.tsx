
import { HelpCircle } from "lucide-react";

export default function HelpSupportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Help & Support</h1>
      </div>
      <p className="text-muted-foreground">
        Find help and support resources for using the platform.
      </p>
    </div>
  );
}
