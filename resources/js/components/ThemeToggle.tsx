import { router } from '@inertiajs/react';
import { IconMoon, IconSun } from '@tabler/icons-react';

interface ThemeToggleProps {
  isDark: boolean;
}

export default function ThemeToggle({ isDark }: ThemeToggleProps) {
  const toggleTheme = () => {
    router.post('/admin/theme/toggle', {}, {
      preserveScroll: true,
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center h-8 w-8 rounded-lg bg-muted hover:bg-accent transition-colors"
      title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {isDark ? (
        <IconSun className="h-4 w-4 text-foreground" />
      ) : (
        <IconMoon className="h-4 w-4 text-foreground" />
      )}
    </button>
  );
}
