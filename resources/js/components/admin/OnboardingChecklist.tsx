import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { trans } from '@/lib/i18n';
import { CheckCircle2, Circle } from 'lucide-react';
import { route } from 'ziggy-js';

interface OnboardingChecklistProps {
  onboardingComplete: boolean;
  onboardingProgress: OnboardingProgress[];
}

interface OnboardingProgress {
  key: string;
  title: string;
  description: string;
  icon: string;
  importance: number;
  completed: boolean;
}

export function OnboardingChecklist({ onboardingComplete, onboardingProgress }: OnboardingChecklistProps) {
  const [items, setItems] = useState<OnboardingProgress[]>(onboardingProgress);

  useEffect(() => {
    setItems(onboardingProgress);
  }, [onboardingProgress]);

  const uncompletedItems = items.filter(item => !item.completed).sort((a, b) => a.importance - b.importance);
  const completedItems = items.filter(item => item.completed);
  const completionPercentage = items.length > 0 ? Math.round((completedItems.length / items.length) * 100) : 0;

  // Show only first uncompleted item
  const visibleUncompletedItems = uncompletedItems.slice(0, 1);
  const hasMoreUncompleted = uncompletedItems.length > 1;

  if (onboardingComplete) {
    return null;
  }

  const getTranslationKey = (stepKey: string): string => {
    const keyMap: Record<string, string> = {
      'site_name': 'site_name',
      'logo': 'logo',
      'theme': 'theme',
      'server': 'server',
      'navigation': 'navigation',
      'first_page': 'first_page',
    };
    return keyMap[stepKey] || stepKey;
  };

  return (
    <Link href="/admin/onboarding" className="block transition-opacity hover:opacity-90">
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">{trans('admin.onboarding.site_setup')}</CardTitle>
              <CardDescription className="text-xs">
                {trans('admin.onboarding.completed', { percent: completionPercentage })}
              </CardDescription>
            </div>
            {uncompletedItems.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {uncompletedItems.length} {uncompletedItems.length === 1 ? 'étape' : 'étapes'} restante{uncompletedItems.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </CardHeader>

      <CardContent className="space-y-2">
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Uncompleted Items - Same style as other action cards */}
        {visibleUncompletedItems.map((item) => {
          const transKey = getTranslationKey(item.key);
          const title = trans(`admin.onboarding.steps.${transKey}.title`);
          const description = trans(`admin.onboarding.steps.${transKey}.description`);

          return (
            <Link
              key={item.key}
              href={route('admin.onboarding.index', { step: item.key })}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-sm">{title}</div>
                <div className="text-xs text-muted-foreground">{description}</div>
              </div>
            </Link>
          );
        })}

        {/* Show more link */}
        {hasMoreUncompleted && (
          <Link
            href="/admin/onboarding"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-sm text-muted-foreground"
          >
            <Circle className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-medium">
                {trans('admin.onboarding.see_more_steps', [
                  uncompletedItems.length - 1,
                  uncompletedItems.length - 1 > 1 ? 's' : '',
                  uncompletedItems.length - 1 > 1 ? 's' : '',
                ])}
              </div>
            </div>
          </Link>
        )}

        {/* Completed items preview */}
        {completedItems.length > 0 && (
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground mb-2">
              {completedItems.length} terminée{completedItems.length > 1 ? 's' : ''}
            </div>
            <div className="flex flex-wrap gap-1">
              {completedItems.slice(0, 3).map((item) => {
                const transKey = getTranslationKey(item.key);
                const title = trans(`admin.onboarding.steps.${transKey}.title`);
                return (
                  <Badge key={item.key} variant="secondary" className="text-xs">
                    {title}
                  </Badge>
                );
              })}
              {completedItems.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{completedItems.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    </Link>
  );
}
