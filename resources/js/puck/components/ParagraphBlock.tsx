import React from "react";

interface ParagraphBlockProps {
  text?: string;
  align?: "left" | "center" | "right";
  size?: "sm" | "base" | "lg";
}

export const ParagraphBlock: React.FC<ParagraphBlockProps> = (props) => {
  const {
    text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    align = "left",
    size = "base",
  } = props || {};

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  const sizeClass = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
  }[size];

  return (
    <p className={`${alignClass} ${sizeClass} text-gray-600 dark:text-gray-300 leading-relaxed`}>
      {text}
    </p>
  );
};
