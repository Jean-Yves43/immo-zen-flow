import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { PanelLeft } from "lucide-react";

import { cn } from "../utils/utils";
import { Button } from "./Button";
import { Sheet, SheetContent, SheetTrigger } from "./Sheet";
import { Separator } from "./Separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";

/* -------------------------------------------------------------------------- */
/*                                   Context                                  */
/* -------------------------------------------------------------------------- */

const SidebarContext = React.createContext(null);

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  children,
}) {
  const [openState, setOpenState] = React.useState(defaultOpen);

  const open = openProp ?? openState;

  const setOpen = React.useCallback(
    (value) => {
      if (onOpenChange) {
        onOpenChange(value);
      } else {
        setOpenState(value);
      }
    },
    [onOpenChange]
  );

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

/* -------------------------------------------------------------------------- */
/*                                   Sidebar                                  */
/* -------------------------------------------------------------------------- */

const sidebarVariants = cva(
  "group/sidebar flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground transition-all",
  {
    variants: {
      collapsible: {
        true: "w-[--sidebar-collapsed-width]",
        false: "",
      },
    },
    defaultVariants: {
      collapsible: false,
    },
  }
);

function Sidebar({ className, collapsible = false, ...props }) {
  const { open } = useSidebar();

  return (
    <aside
      data-state={open ? "open" : "collapsed"}
      className={cn(
        sidebarVariants({ collapsible: !open && collapsible }),
        className
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                               Sidebar Trigger                               */
/* -------------------------------------------------------------------------- */

function SidebarTrigger({ className, ...props }) {
  const { open, setOpen } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => setOpen(!open)}
      {...props}
    >
      <PanelLeft className="h-5 w-5" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Sidebar Header                                */
/* -------------------------------------------------------------------------- */

function SidebarHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center gap-2 p-4", className)}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                Sidebar Content                              */
/* -------------------------------------------------------------------------- */

function SidebarContent({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto px-2",
        className
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Sidebar Group                               */
/* -------------------------------------------------------------------------- */

function SidebarGroup({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col gap-1 px-2", className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({ className, ...props }) {
  return (
    <div
      className={cn(
        "px-2 py-1 text-xs font-medium text-sidebar-foreground/60",
        className
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Sidebar Menu                                */
/* -------------------------------------------------------------------------- */

function SidebarMenu({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
}

const SidebarMenuItem = React.forwardRef(
  ({ asChild = false, className, tooltip, ...props }, ref) => {
    const { open } = useSidebar();
    const Comp = asChild ? Slot : "button";

    const content = (
      <Comp
        ref={ref}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-sidebar-accent",
          className
        )}
        {...props}
      />
    );

    if (!tooltip || open) return content;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{tooltip}</TooltipContent>
      </Tooltip>
    );
  }
);
SidebarMenuItem.displayName = "SidebarMenuItem";

/* -------------------------------------------------------------------------- */
/*                              Sidebar Footer                                 */
/* -------------------------------------------------------------------------- */

function SidebarFooter({ className, ...props }) {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                            Sidebar Mobile (Sheet)                           */
/* -------------------------------------------------------------------------- */

function SidebarMobile({ children }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <PanelLeft className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        {children}
      </SheetContent>
    </Sheet>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */

export {
  SidebarProvider,
  useSidebar,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMobile,
  Separator,
};
