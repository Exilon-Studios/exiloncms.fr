import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState, FormEvent } from 'react';
import { PageProps } from '@/types';
import { router } from '@inertiajs/react';
import { trans } from '@/lib/i18n';
import { SiteNameStep } from '@/components/admin/onboarding/SiteNameStep';
import { LogoStep } from '@/components/admin/onboarding/LogoStep';
import { ThemeStep } from '@/components/admin/onboarding/ThemeStep';
import { ServerStep } from '@/components/admin/onboarding/ServerStep';
import { NavigationStep } from '@/components/admin/onboarding/NavigationStep';
import { FirstPageStep } from '@/components/admin/onboarding/FirstPageStep';

interface Step {
  key: string;
  title: string;
  description: string;
  icon: string;
  importance: number;
  completed?: boolean;
}

interface Props {
  allSteps: Step[];
  currentStep: string;
  currentStepIndex: number;
  userProgress: Step[];
  completion: number;
  existingData: Record<string, any>;
  settings: {
    name?: string;
    description?: string;
    logo?: string;
    favicon?: string;
    darkTheme?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
}

export default function OnboardingIndex({
  allSteps,
  currentStep,
  currentStepIndex,
  userProgress,
  completion,
  existingData,
  settings,
}: Props) {
  const [stepData, setStepData] = useState<Record<string, any>>({});
  const [currentStepData, setCurrentStepData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing data for current step
  useEffect(() => {
    setCurrentStepData(existingData);
    setStepData(existingData);
  }, [currentStep, existingData]);

  const submitStep = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post(route('admin.onboarding.save', currentStep), stepData, {
      onSuccess: () => {
        setIsSubmitting(false);
      },
      onError: () => {
        setIsSubmitting(false);
      },
    });
  };

  const skipStep = () => {
    if (confirm(trans('admin.onboarding.skip_step_confirm'))) {
      router.post(route('admin.onboarding.skip', currentStep));
    }
  };

  const completeOnboarding = () => {
    if (confirm(trans('admin.onboarding.complete_onboarding_confirm'))) {
      router.post(route('admin.onboarding.complete'));
    }
  };

  const renderStep = () => {
    const commonProps = {
      data: stepData,
      setData: setStepData,
      settings,
    };

    switch (currentStep) {
      case 'site_name':
        return <SiteNameStep {...commonProps} />;
      case 'logo':
        return <LogoStep {...commonProps} />;
      case 'theme':
        return <ThemeStep {...commonProps} />;
      case 'server':
        return <ServerStep {...commonProps} />;
      case 'navigation':
        return <NavigationStep {...commonProps} />;
      case 'first_page':
        return <FirstPageStep {...commonProps} />;
      default:
        return <SiteNameStep {...commonProps} />;
    }
  };

  const currentStepInfo = allSteps[currentStepIndex] || allSteps[0];
  const isLastStep = currentStepIndex === allSteps.length - 1;

  return (
    <>
      <Head title={trans('admin.onboarding.page_title', { title: currentStepInfo.title })} />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-foreground">
                  {trans('admin.onboarding.site_setup_title')}
                </h1>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  {trans('admin.onboarding.completed', { percent: completion })}
                </span>
              </div>
              <button
                onClick={completeOnboarding}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {trans('admin.onboarding.skip_all_button')}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {trans('admin.onboarding.step_label', { current: currentStepIndex + 1, total: allSteps.length })}
                </span>
              </div>

              {/* Step indicators */}
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {allSteps.map((step, index) => (
                  <button
                    key={step.key}
                    onClick={() => {
                      if (index <= currentStepIndex || userProgress[index]?.completed) {
                        router.get(route('admin.onboarding.index', { step: step.key }));
                      }
                    }}
                    disabled={index > currentStepIndex && !userProgress[index]?.completed}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      step.key === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : userProgress[index]?.completed
                        ? 'bg-muted text-foreground hover:bg-muted/80 cursor-pointer'
                        : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      userProgress[index]?.completed
                        ? 'bg-green-500 text-white'
                        : step.key === currentStep
                        ? 'bg-white/20'
                        : 'bg-muted'
                    }`}>
                      {userProgress[index]?.completed ? '✓' : index + 1}
                    </span>
                    {step.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Step Description */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {currentStepInfo.title}
            </h2>
            <p className="text-muted-foreground">
              {currentStepInfo.description}
            </p>
          </div>

          {/* Step Form */}
          <form onSubmit={submitStep}>
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
              {renderStep()}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                type="button"
                onClick={skipStep}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {trans('admin.onboarding.skip_step_button')}
              </button>

              <div className="flex gap-3">
                {currentStepIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const prevStep = allSteps[currentStepIndex - 1];
                      router.get(route('admin.onboarding.index', { step: prevStep.key }));
                    }}
                    className="px-6 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    {trans('admin.onboarding.previous_button')}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      {trans('admin.onboarding.saving_button')}
                    </>
                  ) : isLastStep ? (
                    trans('admin.onboarding.finish_button')
                  ) : (
                    <>
                      {trans('admin.onboarding.next_button')}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Quick Access Panel */}
          <div className="mt-8 p-6 bg-muted/30 border border-border rounded-xl">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              {trans('admin.onboarding.remaining_config')}
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {userProgress.filter(s => !s.completed).map((step) => (
                <button
                  key={step.key}
                  onClick={() => router.get(route('admin.onboarding.index', { step: step.key }))}
                  className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors text-left"
                >
                  <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    {step.importance}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
