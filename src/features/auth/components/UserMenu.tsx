import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch } from "@/store/hooks";
import { useAuth } from "@/features/auth/selectors";
import { clearSession } from "@/features/auth/authSlice";
import { resetJourney } from "@/features/journey/journeySlice";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    // Logging out clears the session AND any in-progress purchase data.
    dispatch(clearSession());
    dispatch(resetJourney());
    navigate(ROUTES.home);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex size-10 items-center justify-center rounded-sm border border-border bg-surface shadow-xs transition-colors hover:bg-muted",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
        aria-label="Account menu"
      >
        <User className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Signed in</DropdownMenuLabel>
        <div className="px-2 pb-2 text-sm font-medium">+91 {user.mobile}</div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={handleLogout}
          className="text-destructive focus:bg-destructive-soft focus:text-destructive"
        >
          <LogOut className="size-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
