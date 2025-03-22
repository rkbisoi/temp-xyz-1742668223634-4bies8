import React from "react";

interface PositionedContainerProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  children: React.ReactNode;
}

export default function PositionedContainer({ position, children }: PositionedContainerProps) {
  const positionClasses = {
    "top-left": "top-4 left-4 ml-24",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4 ml-24",
    "bottom-right": "bottom-4 right-4",
  };

  return <div className={`fixed z-50 ${positionClasses[position]}`}>{children}</div>;
}
