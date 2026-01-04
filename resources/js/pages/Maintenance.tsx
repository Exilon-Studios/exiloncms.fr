/**
 * Maintenance Page
 * Displayed when site is in maintenance mode
 */

import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useTrans } from '@/hooks/useTrans';

interface Props extends PageProps {
  message: string;
  title?: string;
  subtitle?: string;
}

export default function Maintenance({ message, title, subtitle }: Props) {
  const { trans } = useTrans();

  // Use custom title/subtitle if provided, otherwise use defaults
  const displayTitle = title || trans('messages.maintenance.title');
  const displayMessage = subtitle || message || trans('messages.maintenance.message');

  return (
    <>
      <Head title={displayTitle} />

      <div className="fixed inset-0 bg-background flex items-center justify-center px-4">
        {/* Grid Background - Adapts to light/dark mode */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 dark:bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[linear-gradient(rgba(0,0,0,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.05)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
        </div>

        {/* Content - Perfectly centered */}
        <div className="relative z-10 max-w-4xl w-full text-center space-y-4">
          {/* Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tight leading-tight">
            {displayTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
            {displayMessage}
          </p>
        </div>
      </div>
    </>
  );
}
