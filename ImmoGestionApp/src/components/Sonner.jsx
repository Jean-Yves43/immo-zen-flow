import React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

/**
 * Composant Toaster global basé sur la librairie Sonner
 * Il affiche les notifications (toasts) dans l'application
 */
const Toaster = (props) => {
  // Récupération du thème courant (light | dark | system)
  const { theme = "system" } = useTheme();

  console.log("[Toaster] Theme actif :", theme);

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background " +
            "group-[.toaster]:text-foreground " +
            "group-[.toaster]:border-border " +
            "group-[.toaster]:shadow-lg",

          description:
            "group-[.toast]:text-muted-foreground",

          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",

          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
