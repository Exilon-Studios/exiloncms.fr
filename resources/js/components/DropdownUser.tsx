import { useState } from 'react';
import { router } from '@inertiajs/react';
import { cn } from "@/lib/utils";
import { trans } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconUser, IconLayoutDashboard, IconShieldCheck, IconLogout, IconPalette } from '@tabler/icons-react';
import { ThemeModal } from "./theme-modal";

interface DropdownUserProps {
  user: {
    name: string;
    email: string;
    role?: {
      id: number;
      name: string;
      is_admin: boolean;
    };
    hasAdminAccess?: boolean;
    avatar?: string;
  };
  align?: "start" | "center" | "end";
  className?: string;
}

export function DropdownUser({ user, align = "end", className }: DropdownUserProps) {
  const [themeModalOpen, setThemeModalOpen] = useState(false);

  const handleLogout = () => {
    router.post('/logout');
  };

  const isAdmin = user.hasAdminAccess || user.role?.is_admin || false;

  // Use Minecraft skin if available, otherwise fallback to avatar or initials
  const avatarUrl = user.avatar || `https://mc-heads.net/avatar/${user.name}/64`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent transition-colors focus:outline-none focus-visible:outline-none focus-visible:ring-0",
          className
        )}>
          <img
            src={avatarUrl}
            className="h-8 w-8 rounded-full object-cover"
            alt={user.name}
            onError={(e) => {
              // Fallback to initials if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.className = 'h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm';
                fallback.textContent = user.name.charAt(0).toUpperCase();
                parent.appendChild(fallback);
              }
            }}
          />
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-foreground">{user.name}</span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-[100]" align={align}>
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.visit('/profile')}>
            <IconUser className="mr-2 h-4 w-4" />
            <span>{trans('messages.nav.profile')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.visit('/dashboard')}>
            <IconLayoutDashboard className="mr-2 h-4 w-4" />
            <span>{trans('messages.nav.dashboard')}</span>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem onClick={() => router.visit('/admin')}>
              <IconShieldCheck className="mr-2 h-4 w-4" />
              <span>{trans('messages.nav.admin')}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setThemeModalOpen(true)}>
          <IconPalette className="mr-2 h-4 w-4" />
          <span>{trans('messages.user.theme')}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <IconLogout className="mr-2 h-4 w-4" />
          <span>{trans('auth.logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>

      <ThemeModal open={themeModalOpen} onOpenChange={setThemeModalOpen} />
    </DropdownMenu>
  );
}
