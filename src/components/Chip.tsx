import React from "react";

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
  children: React.ReactNode;
}

export default function Chip({
  active = false,
  className = "",
  style = {},
  children,
  ...props
}: ChipProps) {
  return (
    <span
      className={`chip ${active ? "active" : ""} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </span>
  );
}
