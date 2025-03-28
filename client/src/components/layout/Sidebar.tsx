import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  Users,
  FileBox,
  Briefcase,
  LogOut,
  Home,
  HelpCircle
} from "lucide-react";
import { useUser } from "@/hooks/use-user";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { user, logout } = useUser();

  const handleLogout = async () => {
    await logout();
  };

  // Case-insensitive check for manager role
  const isManager = user?.role?.toLowerCase() === "manager";

  return (
    <div className={cn("pb-12 min-h-screen bg-[#1a73e8] relative", className)}>
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
              className={cn(
                "w-full justify-start text-white",
                location === "/" ? "bg-white text-[#1a73e8]" : "hover:bg-[#d557ff] hover:text-white"
              )}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/smock-walk">
            <Button
              variant={location === "/smock-walk" ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-white",
                location === "/smock-walk" ? "bg-white text-[#1a73e8]" : "hover:bg-[#d557ff] hover:text-white"
              )}
            >
              <Home className="mr-2 h-4 w-4" />
              Smock Walk
            </Button>
          </Link>
          <Link href="/young-people">
            <Button
              variant={location === "/young-people" ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-white",
                location === "/young-people" ? "bg-white text-[#1a73e8]" : "hover:bg-[#d557ff] hover:text-white"
              )}
            >
              <Users className="mr-2 h-4 w-4" />
              Young People
            </Button>
          </Link>
          <Link href="/hr">
            <Button
              variant={location === "/hr" ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-white",
                location === "/hr" ? "bg-white text-[#1a73e8]" : "hover:bg-[#d557ff] hover:text-white"
              )}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Human Resources
            </Button>
          </Link>
          {isManager && (
            <Link href="/business-vault">
              <Button
                variant={location === "/business-vault" ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-white",
                  location === "/business-vault" ? "bg-white text-[#1a73e8]" : "hover:bg-[#d557ff] hover:text-white"
                )}
              >
                <FileBox className="mr-2 h-4 w-4" />
                Business Vault
              </Button>
            </Link>
          )}
          <Link href="/help-support">
            <Button
              variant={location === "/help-support" ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-white",
                location === "/help-support" ? "bg-white text-[#1a73e8]" : "hover:bg-[#d557ff] hover:text-white"
              )}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-[#d557ff] hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}