"use client";

import { Leap } from "loading-dev";

interface LoadingProps {
  text?: string;
  size?: number;
  color?: string;
  className?: string;
}

export default function Loading({
  text = "Memuat berita...",
  size = 32,
  color = "#2563eb",
  className = "",
}: LoadingProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[320px] w-full gap-4 py-12 ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <Leap size={size} color={color} />
      </div>
      {text && (
        <p className="text-sm font-medium text-muted-foreground animate-pulse tracking-wide">
          {text}
        </p>
      )}
    </div>
  );
}

