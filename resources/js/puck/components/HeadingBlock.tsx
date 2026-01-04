import React from "react";

interface HeadingBlockProps {
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  text?: string;
  align?: "left" | "center" | "right";
  color?: string;
}

export const HeadingBlock: React.FC<HeadingBlockProps> = (props) => {
  const {
    level = "h2",
    text = "Votre titre ici",
    align = "left",
    color,
  } = props || {};

  const Tag = level as keyof JSX.IntrinsicElements;

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  const style: React.CSSProperties = {
    color: color || undefined,
  };

  const sizeClasses = {
    h1: "text-4xl md:text-6xl font-bold",
    h2: "text-3xl md:text-5xl font-bold",
    h3: "text-2xl md:text-4xl font-bold",
    h4: "text-xl md:text-3xl font-bold",
    h5: "text-lg md:text-2xl font-bold",
    h6: "text-base md:text-xl font-bold",
  };

  return (
    <Tag className={`${alignClass} ${sizeClasses[level]}`} style={style}>
      {text}
    </Tag>
  );
};
