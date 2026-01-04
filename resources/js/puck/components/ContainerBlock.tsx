import React from "react";

interface ContainerBlockProps {
  children?: React.ReactNode;
  max_width?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  background_color?: string;
}

export const ContainerBlock: React.FC<ContainerBlockProps> = (props) => {
  const {
    children,
    max_width = "xl",
    padding = "md",
    background_color = "transparent",
  } = props || {};

  // Max width classes
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full",
  };

  // Padding classes
  const paddingClasses = {
    none: "",
    sm: "px-4 py-2",
    md: "px-6 py-4",
    lg: "px-8 py-6",
  };

  const style: React.CSSProperties = {
    backgroundColor: background_color || undefined,
  };

  return (
    <div
      className={`${maxWidthClasses[max_width]} mx-auto ${paddingClasses[padding]}`}
      style={style}
    >
      {children}
    </div>
  );
};
