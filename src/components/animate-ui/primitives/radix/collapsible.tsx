import * as React from "react";
import { cn } from "@/lib/utils";

interface CollapsibleContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CollapsibleContext = React.createContext<CollapsibleContextType>({
  open: false,
  onOpenChange: () => {},
});

export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  asChild?: boolean;
}

export const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ open: controlledOpen, defaultOpen = false, onOpenChange, className, children, ...props }, ref) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;

    const handleOpenChange = React.useCallback(
      (value: boolean) => {
        if (!isControlled) {
          setUncontrolledOpen(value);
        }
        onOpenChange?.(value);
      },
      [isControlled, onOpenChange]
    );

    return (
      <CollapsibleContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
        <div
          ref={ref}
          data-state={open ? "open" : "closed"}
          className={cn("group/collapsible", className)}
          {...props}
        >
          {children}
        </div>
      </CollapsibleContext.Provider>
    );
  }
);
Collapsible.displayName = "Collapsible";

export interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ asChild, onClick, children, className, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(CollapsibleContext);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        onOpenChange(!open);
      }
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{
        onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
        "data-state"?: string;
        className?: string;
      }>;
      return React.cloneElement(child, {
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
        ref={ref}
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
);
CollapsibleTrigger.displayName = "CollapsibleTrigger";

export interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open } = React.useContext(CollapsibleContext);

    if (!open) return null;

    return (
      <div
        ref={ref}
        data-state={open ? "open" : "closed"}
        className={cn(
          "overflow-hidden transition-all duration-300 animate-in fade-in-50",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CollapsibleContent.displayName = "CollapsibleContent";

