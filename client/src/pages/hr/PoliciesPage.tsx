
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PoliciesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Book className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Policies & Procedures</h1>
      </div>
      <p className="text-muted-foreground">
        Access and review company policies, procedures, and employee handbooks.
      </p>

      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Employee Handbook</h3>
                <p className="text-sm text-muted-foreground">Last updated: March 2024</p>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Health & Safety Policy</h3>
                <p className="text-sm text-muted-foreground">Last updated: February 2024</p>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
