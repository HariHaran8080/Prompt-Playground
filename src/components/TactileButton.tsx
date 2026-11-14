import * as React from "react";
import { cn } from "@/lib/utils";

export interface TactileButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "dark" | "outline" | "terracotta";
  isLoading?: boolean;
}

export const TactileButton = React.forwardRef<
  HTMLButtonElement,
  TactileButtonProps
>(
  (
    {
      children,
      className,
      size = "md",
      variant = "terracotta",
      disabled,
      isLoading,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-8 px-3 text-xs gap-1.5 rounded-none",
      md: "h-9 px-4 text-xs font-medium gap-2 rounded-none",
      lg: "h-11 px-5 text-sm font-semibold gap-2.5 rounded-none",
    }[size];

    const variantClasses = {
      terracotta: cn(
        "bg-gradient-to-b from-[#e66a41] to-[#cf5227] text-white",
        "border border-t-[#f3835e] border-x-[#d7572d] border-b-[#9e3412]",
        "shadow-[0_3px_0_0_#9e3412,0_5px_8px_-1px_rgba(223,95,52,0.4)]",
        "hover:from-[#ed744c] hover:to-[#d9592f] hover:shadow-[0_3.5px_0_0_#9e3412,0_7px_12px_-2px_rgba(223,95,52,0.45)]",
        "active:translate-y-[2.5px] active:shadow-[0_0.5px_0_0_#9e3412,0_2px_4px_rgba(0,0,0,0.25)]",
        "focus-visible:ring-2 focus-visible:ring-[#df5f34] focus-visible:ring-offset-2"
      ),
      dark: cn(
        "bg-gradient-to-b from-[#2a2a2e] to-[#161618] text-white",
        "border border-t-[#45454a] border-x-[#2e2e32] border-b-[#0c0c0e]",
        "shadow-[0_3px_0_0_#09090b,0_5px_8px_-1px_rgba(0,0,0,0.4)]",
        "hover:from-[#323238] hover:to-[#1c1c1f]",
        "active:translate-y-[2.5px] active:shadow-[0_0.5px_0_0_#09090b,0_2px_4px_rgba(0,0,0,0.3)]",
        "focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      ),
      primary: cn(
        "bg-gradient-to-b from-[#e66a41] to-[#cf5227] text-white",
        "border border-t-[#f3835e] border-x-[#d7572d] border-b-[#9e3412]",
        "shadow-[0_3px_0_0_#9e3412,0_4px_8px_rgba(223,95,52,0.35)]",
        "hover:from-[#ed744c] hover:to-[#d9592f]",
        "active:translate-y-[2.5px] active:shadow-[0_0.5px_0_0_#9e3412]",
        "focus-visible:ring-2 focus-visible:ring-[#df5f34] focus-visible:ring-offset-2"
      ),
      outline: cn(
        "bg-gradient-to-b from-white to-[#f4f4f5] text-gray-800",
        "border border-t-[#e4e4e7] border-x-[#d4d4d8] border-b-[#a1a1aa]",
        "shadow-[0_3px_0_0_#a1a1aa,0_3px_6px_rgba(0,0,0,0.08)]",
        "hover:from-[#fafafa] hover:to-[#ebebef]",
        "active:translate-y-[2.5px] active:shadow-[0_0.5px_0_0_#a1a1aa]",
        "focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
      ),
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "relative inline-flex select-none items-center justify-center font-sans tracking-tight",
          "transition-[transform,box-shadow,background-color] duration-100 ease-out",
          "disabled:opacity-50 disabled:pointer-events-none disabled:active:translate-y-0",
          sizeClasses,
          variantClasses,
          className
        )}
        {...props}
      >
        {/* Specular highlight */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-1.5 top-[1px] h-[1px] bg-white/25 rounded-none"
        />

        {children}
      </button>
    );
  }
);
TactileButton.displayName = "TactileButton";
