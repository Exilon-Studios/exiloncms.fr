/**
 * Collapsible Admin Sidebar - Converted from Next.js to Inertia.js
 * Uses motion animations and @tabler/icons-react
 */

"use client";

import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconApi,
  IconMenu2,
  IconMessagePlus,
  IconRotate,
  IconX,
  IconArrowNarrowLeft,
  IconChecklist,
} from "@tabler/icons-react";
import { DropdownUser } from "@/components/DropdownUser";

interface Links {
  label: string;
  href?: string;
  icon?: React.JSX.Element | React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  type?: string;
  children?: Links[];
  badge?: number;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined,
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen } = useSidebar();
  return (
    <div className="hidden md:flex h-full py-4">
      <motion.div
        className={cn(
          "group/sidebar-btn relative mx-2 h-full w-[300px] flex-shrink-0 rounded-xl bg-card px-4 py-6 flex flex-col",
          className,
        )}
        animate={{ width: open ? "300px" : "80px" }}
        {...props}
      >
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "absolute top-4 -right-2 z-40 hidden h-5 w-5 transform items-center justify-center rounded-sm bg-background transition duration-200 group-hover/sidebar-btn:flex",
          open ? "rotate-0" : "rotate-180",
        )}
      >
        <IconArrowNarrowLeft className="text-foreground" />
      </button>
      {children as React.ReactNode}
    </motion.div>
    </div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen } = useSidebar();
  return (
    <motion.div
      className={cn(
        "flex h-10 w-full flex-row items-center justify-between bg-muted px-4 py-4 md:hidden",
      )}
      {...props}
    >
      <div className="z-20 flex w-full justify-end">
        <IconMenu2
          className="text-foreground"
          onClick={() => setOpen(!open)}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "fixed inset-0 z-[100] flex h-full w-full flex-col justify-between bg-background p-10",
              className,
            )}
          >
            <div
              className="absolute top-10 right-10 z-50 text-foreground"
              onClick={() => setOpen(!open)}
            >
              <IconX />
            </div>
            {children as React.ReactNode}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const SidebarSeparator = ({ label, className }: { label: string; className?: string }) => {
  const { open } = useSidebar();

  if (!open) {
    return <div className={cn("h-px bg-muted mx-2 my-2", className)} />;
  }

  return (
    <div className={cn("px-3 py-2 mt-4 mb-1", className)}>
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
};

export const SidebarSection = ({
  section,
  className
}: {
  section: Links;
  className?: string;
}) => {
  const { open } = useSidebar();

  // Utiliser localStorage pour persister l'état
  const storageKey = `sidebar-section-${section.label}`;
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem(storageKey);
    return stored === null ? true : stored === 'true';
  });

  const toggleExpanded = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem(storageKey, String(newState));
  };

  // Quand la sidebar est fermée, afficher les liens directement avec un séparateur
  if (!open) {
    return (
      <>
        <div className={cn("h-px bg-muted mx-2 my-2", className)} />
        {section.children?.map((link, idx) => (
          <SidebarLink key={idx} link={link} />
        ))}
      </>
    );
  }

  return (
    <div className={cn("mt-4", className)}>
      <button
        onClick={toggleExpanded}
        className="w-full px-3 py-2 flex items-center justify-between hover:bg-accent rounded-sm transition-colors"
      >
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {section.label}
        </span>
        <motion.div
          animate={{ rotate: isExpanded ? 0 : -90 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <IconArrowNarrowLeft className="h-3 w-3 text-muted-foreground rotate-[-90deg]" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={false}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-1">
              {section.children?.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
}: {
  link: Links;
  className?: string;
}) => {
  const { open } = useSidebar();

  // Si c'est une section avec enfants
  if (link.type === 'section' && link.children) {
    return <SidebarSection section={link} className={className} />;
  }

  // Si c'est un séparateur
  if (link.type === 'separator') {
    return <SidebarSeparator label={link.label} className={className} />;
  }

  return (
    <Link
      href={link.href!}
      onClick={link.onClick}
      className={cn(
        "group/sidebar flex items-center gap-2 rounded-sm px-2 py-2 hover:bg-accent hover:text-accent-foreground transition-colors relative",
        open ? "justify-start" : "justify-center",
        className,
      )}
    >
      {link.icon}

      <motion.span
        animate={{
          display: open ? "inline-block" : "none",
          opacity: open ? 1 : 0,
        }}
        className="!m-0 inline-block !p-0 text-sm whitespace-pre text-foreground transition duration-150"
      >
        {link.label}
      </motion.span>

      {/* Badge for updates count */}
      {link.badge !== undefined && link.badge > 0 && (
        <motion.div
          animate={{
            scale: open ? 1 : 0.7,
          }}
          className="ml-auto flex items-center justify-center bg-red-600 text-white text-xs font-bold rounded-full h-5 min-w-[20px] px-1"
        >
          {link.badge > 99 ? '99+' : link.badge}
        </motion.div>
      )}
    </Link>
  );
};

export const Logo = ({ siteName }: { siteName: string }) => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-foreground"
    >
      <div className="h-5 w-6 flex-shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-primary" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-foreground"
      >
        {siteName}
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-foreground"
    >
      <div className="h-5 w-6 flex-shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-primary" />
    </Link>
  );
};

export function SidebarLayout({
  className,
  children,
  primaryLinks,
  secondaryLinks,
  userInfo,
  siteName = 'ExilonCMS',
}: {
  className?: string;
  children: React.ReactNode;
  primaryLinks: Links[];
  secondaryLinks: Links[];
  userInfo: {
    name: string;
    avatar?: string;
  };
  siteName?: string;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={cn(
        "flex w-full flex-col bg-background md:flex-row",
        "h-screen overflow-hidden",
        className,
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className={cn(
            "flex flex-1 flex-col overflow-x-hidden overflow-y-auto",
            "scrollbar-hide"
          )}>
            {open ? <Logo siteName={siteName} /> : <LogoIcon />}
            <div className="mt-8 flex flex-col">
              {primaryLinks.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1 pb-2">
            {secondaryLinks.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
            {open ? (
              <div className="mt-2">
                <DropdownUser
                  user={{
                    name: userInfo.name,
                    email: userInfo.email || '',
                    role: userInfo.role || '',
                    avatar: userInfo.avatar
                  }}
                  align="end"
                  className="w-full justify-start"
                />
              </div>
            ) : (
              <div className="mt-2">
                <SidebarLink
                  link={{
                    label: userInfo.name,
                    href: "/profile",
                    icon: userInfo.avatar ? (
                      <img
                        src={userInfo.avatar || `https://mc-heads.net/avatar/${userInfo.name}/64`}
                        className="h-5 w-5 flex-shrink-0 rounded-full object-cover"
                        width={50}
                        height={50}
                        alt="Avatar"
                      />
                    ) : (
                      <div className="h-5 w-5 flex-shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                        {userInfo.name.charAt(0).toUpperCase()}
                      </div>
                    ),
                  }}
                />
              </div>
            )}
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
