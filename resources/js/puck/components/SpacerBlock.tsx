import React from "react";

interface SpacerBlockProps {
  height?: number;
}

export const SpacerBlock: React.FC<SpacerBlockProps> = (props) => {
  const { height = 40 } = props || {};

  return <div style={{ height: `${height}px` }} />;
};
