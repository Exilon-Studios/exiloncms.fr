/**
 * Auth UI Components - Login/Register gradient design
 * Converted from Next.js to Inertia.js React
 */

import { cn } from "@/lib/utils";
import * as LabelPrimitive from "@radix-ui/react-label";
import React from "react";
import { trans } from "@/lib/i18n";

export const LogoSVG = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="20"
      height="24"
      viewBox="0 0 20 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 4.5C0 3.11929 1.11929 2 2.5 2H7.5C8.88071 2 10 3.11929 10 4.5V9.40959C10.0001 9.4396 10.0002 9.46975 10.0002 9.50001C10.0002 10.8787 11.1162 11.9968 12.4942 12C12.4961 12 12.4981 12 12.5 12H17.5C18.8807 12 20 13.1193 20 14.5V19.5C20 20.8807 18.8807 22 17.5 22H12.5C11.1193 22 10 20.8807 10 19.5V14.5C10 14.4931 10 14.4861 10.0001 14.4792C9.98891 13.1081 8.87394 12 7.50017 12C7.4937 12 7.48725 12 7.48079 12H2.5C1.11929 12 0 10.8807 0 9.5V4.5Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const Container = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("mx-auto max-w-7xl", className)} {...props}>
      {children}
    </div>
  );
};

export const Heading = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h1
      className={cn(
        "text-center text-3xl font-medium tracking-tight text-black md:text-4xl lg:text-6xl dark:text-white",
        className,
      )}
    >
      {children}
    </h1>
  );
};

export const SubHeading = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2
      className={cn(
        "text-center text-sm font-medium tracking-tight text-gray-600 md:text-sm lg:text-base dark:text-gray-300",
        className,
      )}
    >
      {children}
    </h2>
  );
};

export const Label = ({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) => {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-charcoal-700 flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 dark:text-neutral-100",
        className,
      )}
      {...props}
    />
  );
};

export const Input = ({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) => {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border-0 bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-neutral-800",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]",
        className,
      )}
      {...props}
    />
  );
};

export const Button = <T extends React.ElementType = "button">({
  children,
  variant = "primary",
  className,
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
} & Omit<
  React.ComponentProps<T>,
  "children" | "variant" | "className" | "as"
>) => {
  return (
    <button
      {...props}
      className={cn(
        "block cursor-pointer rounded-xl px-6 py-2 text-center text-sm font-medium transition duration-150 active:scale-[0.98] sm:text-base",
        variant === "primary" &&
          "bg-charcoal-900 text-white dark:bg-white dark:text-black",
        variant === "secondary" && "bg-neutral-800 text-white",

        className,
      )}
    >
      {children}
    </button>
  );
};

export const AuthIllustration = ({ siteName = "ExilonCMS" }: { siteName?: string }) => {
  return (
    <div className="relative flex min-h-80 flex-col items-start justify-end overflow-hidden rounded-2xl bg-black p-4 md:p-8">
      <div className="relative z-40 mb-2 flex items-center gap-2">
        <p className="rounded-md bg-black/50 px-2 py-1 text-xs text-white">
          {trans('auth.features.minecraft')}
        </p>
        <p className="rounded-md bg-black/50 px-2 py-1 text-xs text-white">
          {trans('auth.features.management')}
        </p>
      </div>
      <div className="relative z-40 max-w-sm rounded-xl bg-black/50 p-4 backdrop-blur-sm">
        <h2 className="text-white">
          {trans('auth.description.main', { siteName })}
        </h2>
        <p className="mt-4 text-sm text-white/50">{trans('auth.features.admin')}</p>
        <p className="mt-1 text-sm text-white/50">
          {trans('auth.powered_by', { siteName })}
        </p>
      </div>

      <div className="mask-r-from-50% absolute -top-48 -right-40 z-20 grid rotate-45 transform grid-cols-4 gap-32">
        <div className="size-40 shrink-0 rounded-3xl bg-neutral-900 shadow-[0px_2px_0px_0px_var(--color-neutral-600)_inset]"></div>
        <div className="size-40 shrink-0 rounded-3xl bg-neutral-900 shadow-[0px_2px_0px_0px_var(--color-neutral-600)_inset]"></div>
        <div className="size-40 shrink-0 rounded-3xl bg-neutral-900 shadow-[0px_2px_0px_0px_var(--color-neutral-600)_inset]"></div>
        <div className="size-40 shrink-0 rounded-3xl bg-neutral-900 shadow-[0px_2px_0px_0px_var(--color-neutral-600)_inset]"></div>
      </div>

      <div className="mask-r-from-50% absolute -top-0 -right-10 z-20 grid rotate-45 transform grid-cols-4 gap-32 opacity-50">
        <div className="size-40 shrink-0 rounded-3xl bg-neutral-900 shadow-[0px_2px_0px_0px_var(--color-neutral-600)_inset]"></div>
        <div className="size-40 shrink-0 rounded-3xl bg-neutral-900 shadow-[0px_2px_0px_0px_var(--color-neutral-600)_inset]"></div>
        <div className="size-40 shrink-0 rounded-3xl bg-neutral-900 shadow-[0px_2px_0px_0px_var(--color-neutral-600)_inset]"></div>
        <div className="size-40 shrink-0 rounded-3xl bg-neutral-900 shadow-[0px_2px_0px_0px_var(--color-neutral-600)_inset]"></div>
      </div>

      {/* Simplified gradient background */}
      <div className="absolute inset-0 z-30 bg-gradient-to-br from-orange-500/20 via-purple-500/20 to-blue-500/20 blur-3xl mask-t-from-50%" />
    </div>
  );
};
