import React from "react";
import { NavLink } from './NavLink';

interface ButtonBlockProps {
  text?: string;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  align?: "left" | "center" | "right";
}

export const ButtonBlock: React.FC<ButtonBlockProps> = (props) => {
  const {
    text = "Cliquez ici",
    href = "#",
    variant = "primary",
    size = "md",
    align = "left",
  } = props || {};

  // Variant styles using Tailwind variables
  const variantClasses = {
    primary: "bg-primary hover:bg-primary/90 text-primary-foreground border-transparent",
    secondary: "bg-secondary hover:bg-secondary/80 text-secondary-foreground border-transparent",
    outline: "bg-transparent hover:bg-accent hover:text-accent-foreground text-foreground border-border",
    ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground text-foreground border-transparent",
  };

  // Size styles
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Container alignment
  const containerAlign = {
    left: "flex justify-start",
    center: "flex justify-center",
    right: "flex justify-end",
  }[align];

  return (
    <div className={containerAlign}>
      <NavLink
        href={href}
        className={`${variantClasses[variant]} ${sizeClasses[size]} inline-flex items-center justify-center border rounded-lg font-medium transition-colors duration-200`}
      >
        {text}
      </NavLink>
    </div>
  );
};
