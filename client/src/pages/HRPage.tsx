import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Clock, Book, FileBox } from "lucide-react";
import { Link } from "wouter";

export default function HRPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/hr/centre">
          <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-5 w-5" />
                <h2 className="text-xl font-semibold">HR Centre</h2>
              </div>
              <p className="text-muted-foreground">
                Access and manage key HR functions, including employee records, performance management, and recruitment processes.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/hr/timesheets">
          <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Timesheets</h2>
              </div>
              <p className="text-muted-foreground">
                Manage and submit employee timesheets, track hours worked, and process payroll information.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/hr/policies">
          <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Book className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Policies & Procedures</h2>
              </div>
              <p className="text-muted-foreground">
                Access and review company policies, procedures, and employee handbooks.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/hr/documents">
          <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <FileBox className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Documents</h2>
              </div>
              <p className="text-muted-foreground">
                Access and manage important HR documents, forms, and files.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}