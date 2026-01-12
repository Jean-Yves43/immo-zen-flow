import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "../utils/utils";

/**
 * Composant Checkbox basé sur Radix UI
 * - Supporte le focus, disabled, checked
 * - Stylé avec Tailwind + shadcn/ui
 */
const Checkbox = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;

  // Log utile en debug (à retirer en prod si besoin)
  console.log("Checkbox render", { props: rest });

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background " +
          "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground " +
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
          "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...rest}
    >
      {/* Icône affichée uniquement quand la checkbox est cochée */}
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

// Nom du composant pour React DevTools
Checkbox.displayName = "Checkbox";

export { Checkbox };
