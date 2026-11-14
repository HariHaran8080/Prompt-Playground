import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownContext = React.createContext<DropdownContextType>({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
});

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-radix-dropdown-content]") && !triggerRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block text-left w-full">{children}</div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({
  asChild,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { open, setOpen, triggerRef } = React.useContext(DropdownContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpen(!open);
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{
      onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
      ref?: React.Ref<HTMLButtonElement>;
      "data-state"?: string;
      className?: string;
    }>;
    return React.cloneElement(child, {
      ref: triggerRef,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        child.props.onClick?.(e);
        handleClick(e);
      },
      "data-state": open ? "open" : "closed",
      className: cn(child.props.className, className),
    });
  }

  return (
    <button
      ref={triggerRef}
      type="button"
      data-state={open ? "open" : "closed"}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export function DropdownMenuContent({
  side = "bottom",
  align = "start",
  className,
  children,
  ...props
}: DropdownMenuContentProps) {
  const { open, setOpen } = React.useContext(DropdownContext);

  if (!open) return null;

  const positionClasses =
    side === "right"
      ? "left-full ml-2 top-0"
      : side === "left"
      ? "right-full mr-2 top-0"
      : side === "top"
      ? "bottom-full mb-2 left-0"
      : align === "end"
      ? "top-full mt-2 right-0"
      : "top-full mt-2 left-0";

  return (
    <div
      data-radix-dropdown-content
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-none border border-gray-200 bg-white p-1 text-gray-800 shadow-md animate-in fade-in zoom-in-95 duration-100",
        positionClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuGroup({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-0.5", className)} {...props}>
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  className,
  children,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { setOpen } = React.useContext(DropdownContext);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);
    setOpen(false);
  };

  return (
    <div
      role="menuitem"
      onClick={handleClick}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-none px-2 py-1.5 text-xs outline-none transition-colors hover:bg-gray-100 hover:text-black data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-2 py-1.5 text-xs font-semibold text-gray-500", className)}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("-mx-1 my-1 h-px bg-gray-100", className)} {...props} />
  );
}

export function DropdownMenuShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("ml-auto text-[10px] tracking-widest text-gray-400", className)}
      {...props}
    />
  );
}

