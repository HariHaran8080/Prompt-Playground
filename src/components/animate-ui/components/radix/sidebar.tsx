import * as React from "react";
import { PanelLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const SIDEBAR_WIDTH = "17.5rem";
const SIDEBAR_WIDTH_ICON = "4.25rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

interface SidebarContextProps {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;

    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }
      },
      [setOpenProp, open]
    );

    const toggleSidebar = React.useCallback(() => {
      return isMobile ? setOpenMobile((prev) => !prev) : setOpen((prev) => !prev);
    }, [isMobile, setOpen, setOpenMobile]);

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

    const state = open ? "expanded" : "collapsed";

    const contextValue = React.useMemo<SidebarContextProps>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          ref={ref}
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full text-sidebar-foreground has-[[data-variant=inset]]:bg-sidebar",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = "SidebarProvider";

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    if (collapsible === "none") {
      return (
        <div
          ref={ref}
          className={cn(
            "group sticky top-0 hidden md:flex h-screen shrink-0 w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border z-30",
            className
          )}
          {...props}
        >
          <div className="flex h-full w-full flex-col justify-between overflow-hidden">{children}</div>
        </div>
      );
    }

    if (isMobile) {
      return (
        <>
          {openMobile && (
            <div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity"
              onClick={() => setOpenMobile(false)}
            />
          )}
          <div
            ref={ref}
            data-mobile="true"
            data-state={openMobile ? "open" : "closed"}
            className={cn(
              "fixed inset-y-0 z-50 flex h-full w-4/5 max-w-xs flex-col bg-sidebar p-0 text-sidebar-foreground shadow-2xl transition-transform duration-300 ease-in-out border-r border-sidebar-border",
              openMobile ? "translate-x-0" : "-translate-x-full",
              className
            )}
            {...props}
          >
            <div className="flex h-full w-full flex-col justify-between overflow-hidden">{children}</div>
          </div>
        </>
      );
    }

    return (
      <div
        ref={ref}
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
        className={cn(
          "group sticky top-0 hidden md:flex h-screen shrink-0 flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-in-out border-r border-sidebar-border z-30",
          state === "expanded"
            ? "w-[--sidebar-width]"
            : collapsible === "icon"
            ? "w-[--sidebar-width-icon]"
            : "w-0 overflow-hidden",
          className
        )}
        {...props}
      >
        <div className="flex h-full w-full flex-col justify-between overflow-hidden">{children}</div>
      </div>
    );
  }
);
Sidebar.displayName = "Sidebar";

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      type="button"
      data-sidebar="trigger"
      aria-label="Toggle Sidebar"
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-none border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black",
        className
      )}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft className="size-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

export const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-gray-300 group-data-[side=left]:-right-4 md:block cursor-ew-resize",
        className
      )}
      {...props}
    />
  );
});
SidebarRail.displayName = "SidebarRail";

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-white overflow-x-hidden",
        className
      )}
      {...props}
    />
  );
});
SidebarInset.displayName = "SidebarInset";

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2 border-b border-sidebar-border/50", className)}
      {...props}
    />
  );
});
SidebarHeader.displayName = "SidebarHeader";

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2 mt-auto border-t border-sidebar-border/50 shrink-0 bg-sidebar", className)}
      {...props}
    />
  );
});
SidebarFooter.displayName = "SidebarFooter";

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden p-2",
        className
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-1.5", className)}
      {...props}
    />
  );
});
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "flex h-7 shrink-0 items-center rounded-none px-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase outline-none group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1 list-none p-0 m-0", className)}
      {...props}
    />
  );
});
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      data-sidebar="menu-item"
      className={cn("group/menu-item relative list-none", className)}
      {...props}
    />
  );
});
SidebarMenuItem.displayName = "SidebarMenuItem";

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string;
  size?: "default" | "sm" | "lg";
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(
  (
    {
      asChild = false,
      isActive = false,
      size = "default",
      tooltip,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const sizeClasses =
      size === "sm"
        ? "h-7 text-xs px-2"
        : size === "lg"
        ? "h-12 text-sm px-2.5"
        : "h-8 text-xs px-2.5";

    const baseClasses = cn(
      "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-none text-left outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>svg]:size-4 [&>svg]:shrink-0",
      isActive && "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
      sizeClasses,
      className
    );

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{
        className?: string;
        title?: string;
      }>;
      return React.cloneElement(child, {
        className: cn(baseClasses, child.props.className),
        title: tooltip ?? child.props.title,
      });
    }

    return (
      <button
        ref={ref}
        type="button"
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        title={tooltip}
        className={baseClasses}
        {...props}
      >
        {children}
      </button>
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

export const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    showOnHover?: boolean;
  }
>(({ asChild = false, showOnHover = false, className, children, ...props }, ref) => {
  const baseClasses = cn(
    "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-none p-0 text-sidebar-foreground outline-none transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&>svg]:size-3.5 group-data-[collapsible=icon]:hidden",
    showOnHover &&
      "opacity-0 transition-opacity group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100",
    className
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string }>;
    return React.cloneElement(child, {
      className: cn(baseClasses, child.props.className),
    });
  }

  return (
    <button
      ref={ref}
      type="button"
      data-sidebar="menu-action"
      className={baseClasses}
      {...props}
    >
      {children}
    </button>
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";

export const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-1 group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  );
});
SidebarMenuSub.displayName = "SidebarMenuSub";

export const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

export const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean;
    isActive?: boolean;
  }
>(({ asChild = false, isActive = false, className, children, ...props }, ref) => {
  const baseClasses = cn(
    "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-none px-2 text-xs text-sidebar-foreground/70 outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50",
    isActive && "font-medium text-sidebar-accent-foreground",
    className
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string }>;
    return React.cloneElement(child, {
      className: cn(baseClasses, child.props.className),
    });
  }

  return (
    <a ref={ref} className={baseClasses} {...props}>
      {children}
    </a>
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

