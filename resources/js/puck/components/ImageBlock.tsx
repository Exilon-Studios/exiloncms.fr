import React from "react";

interface ImageBlockProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  rounded?: boolean;
}

export const ImageBlock: React.FC<ImageBlockProps> = (props) => {
  const {
    src = "https://via.placeholder.com/800x400",
    alt = "Image",
    width,
    height,
    rounded = true,
  } = props || {};

  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  const roundedClass = rounded ? "rounded-lg" : "";

  return (
    <img
      src={src}
      alt={alt}
      style={style}
      className={`w-full ${roundedClass} object-cover`}
    />
  );
};
