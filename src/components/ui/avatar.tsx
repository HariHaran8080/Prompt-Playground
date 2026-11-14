import * as React from "react";
import { cn } from "@/lib/utils";

export function Avatar({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex h-8 w-8 shrink-0 overflow-hidden rounded-none bg-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarImage({
  src,
  alt = "",
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [error, setError] = React.useState(false);

  if (error || !src) return null;

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  );
}

export function AvatarFallback({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-none bg-gray-100 font-medium text-xs text-gray-700",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

