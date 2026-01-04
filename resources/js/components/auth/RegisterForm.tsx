import React, { FormEvent } from "react";
import { Link } from "@inertiajs/react";
import { Label, Input, Button } from './LoginForm';
import { RegisterFormData } from '@/types/auth';
import { useTrans } from "@/lib/trans";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RegisterFormProps {
  data: RegisterFormData;
  setData: (key: string, value: any) => void;
  onSubmit: (e: FormEvent) => void;
  processing: boolean;
  errors: Record<string, string>;
  siteName: string;
  siteDescription: string;
  registerConditions?: string;
}

export function RegisterFormWithGradient({
  data,
  setData,
  onSubmit,
  processing,
  errors,
  siteName,
  siteDescription,
  registerConditions,
}: RegisterFormProps) {
  const t = useTrans();

  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex w-full items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Logo and Title */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="text-lg font-bold text-foreground">{siteName}</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {t('auth.register')}
          </h2>

          {/* Form */}
          <div className="mt-10">
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <Label htmlFor="name">{t('auth.name')}</Label>
                <div className="mt-2">
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('auth.name')}
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                    autoFocus
                    maxLength={25}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-destructive">{errors.name}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">{t('auth.email')}</Label>
                <div className="mt-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.email')}
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                    maxLength={50}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">{t('auth.password')}</Label>
                <div className="mt-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('auth.password_placeholder')}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    required
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-destructive">{errors.password}</p>
                  )}
                </div>
              </div>

              {/* Password Confirmation */}
              <div>
                <Label htmlFor="password_confirmation">{t('auth.confirm_password')}</Label>
                <div className="mt-2">
                  <Input
                    id="password_confirmation"
                    type="password"
                    placeholder={t('auth.password_placeholder')}
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    required
                  />
                  {errors.password_confirmation && (
                    <p className="mt-2 text-sm text-destructive">{errors.password_confirmation}</p>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              {registerConditions && (
                <div className="flex items-start">
                  <input
                    id="conditions"
                    type="checkbox"
                    checked={data.conditions}
                    onChange={(e) => setData('conditions', e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary bg-background"
                    required
                  />
                  <label htmlFor="conditions" className="ml-2 text-sm leading-tight text-muted-foreground">
                    <span dangerouslySetInnerHTML={{ __html: registerConditions }} />
                  </label>
                </div>
              )}
              {errors.conditions && (
                <p className="text-sm text-destructive">{errors.conditions}</p>
              )}

              {/* Submit Button */}
              <div>
                <Button type="submit" disabled={processing}>
                  {processing ? t('messages.loading') : t('auth.register')}
                </Button>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                  {t('auth.have_account')}{" "}
                  <Link href="/login" className="font-medium text-primary hover:underline">
                    {t('auth.login')}
                  </Link>
                </p>
              </div>
            </form>

            {/* Divider - Hidden until SocialAuth plugin is installed */}
            <div className="mt-10 hidden">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm font-medium">
                  <span className="bg-background px-6 text-muted-foreground">
                    {t('auth.continue_with')}
                  </span>
                </div>
              </div>

              {/* OAuth Buttons - Placeholder for SocialAuth plugin */}
              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                  </svg>
                  {t('auth.sign_up_with')} {t('auth.google')}
                </button>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
                  </svg>
                  {t('auth.sign_up_with')} {t('auth.discord')}
                </button>
              </div>

              <p className="mt-8 text-center text-sm text-muted-foreground">
                {t('auth.terms_agree_register')}{" "}
                <Link href="/terms" className="text-foreground hover:underline">
                  {t('auth.terms_of_service')}
                </Link>{" "}
                {t('auth.and')}{" "}
                <Link href="/privacy" className="text-foreground hover:underline">
                  {t('auth.privacy_policy')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Feature Section */}
      <RightSideContent siteName={siteName} />
    </div>
  );
}

function RightSideContent({ siteName }: { siteName: string }) {
  const t = useTrans();

  return (
    <div className="relative z-20 hidden w-full items-center justify-center overflow-hidden border-l border-border bg-card lg:flex">
      <div className="mx-auto max-w-sm px-8">
        {/* Player Avatars */}
        <FeaturedPlayers />

        <p className="text-center text-xl font-semibold text-foreground mt-4">
          {t('auth.join_community')}
        </p>

        <p className="mt-8 text-center text-base text-muted-foreground">
          {siteName} {t('auth.community_message')}
        </p>
      </div>

      {/* Grid Lines */}
      <GridLineHorizontal className="top-4 left-1/2 -translate-x-1/2" />
      <GridLineHorizontal className="top-auto bottom-4 left-1/2 -translate-x-1/2" />
      <GridLineVertical className="top-1/2 left-10 -translate-y-1/2" />
      <GridLineVertical className="top-1/2 right-10 left-auto -translate-y-1/2" />
    </div>
  );
}

function FeaturedPlayers() {
  const players = [
    { name: "Player 1", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
    { name: "Player 2", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" },
    { name: "Player 3", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver" },
    { name: "Player 4", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna" },
    { name: "Player 5", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max" },
    { name: "Player 6", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie" },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex flex-row items-center">
        {players.map((player, idx) => (
          <div className="group relative -mr-4" key={idx}>
            <motion.div
              whileHover={{ scale: 1.05, zIndex: 30 }}
              transition={{ duration: 0.2 }}
              className="relative overflow-hidden rounded-full border-2 border-primary/20 bg-background"
            >
              <img
                src={player.avatar}
                alt={player.name}
                className="h-12 w-12 object-cover"
              />
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GridLineHorizontal({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute h-px w-[calc(100%-80px)]",
        "bg-gradient-to-r from-transparent via-border to-transparent",
        className,
      )}
    />
  );
}

function GridLineVertical({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute w-px h-[calc(100%-80px)]",
        "bg-gradient-to-b from-transparent via-border to-transparent",
        className,
      )}
    />
  );
}
