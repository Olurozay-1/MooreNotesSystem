import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  Users,
  FileBox,
  Briefcase,
  LogOut
} from "lucide-react";
import { useUser } from "@/hooks/use-user";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { logout } = useUser();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className={cn("pb-12 min-h-screen bg-[#1a73e8]", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight text-white">
            Moore Notes
          </h2>
          <h3 className="px-2 text-sm text-white/70">
            Smock Walk
          </h3>
        </div>
        <div className="space-y-1 px-3">
          <Link href="/">
            <Button
              variant={location === "/" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:text-black"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/young-people">
            <Button
              variant={location === "/young-people" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:text-black"
            >
              <Users className="mr-2 h-4 w-4" />
              Young People
            </Button>
          </Link>
          <Link href="/hr">
            <Button
              variant={location === "/hr" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:text-black"
            >
              <Briefcase className="mr-2 h-4 w-4" />
              HR
            </Button>
          </Link>
          <Link href="/business-vault">
            <Button
              variant={location === "/business-vault" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:text-black"
            >
              <FileBox className="mr-2 h-4 w-4" />
              Business Vault
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:text-black"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
