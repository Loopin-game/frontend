import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary CTA - Hyper-Volt (The Hero)
        default:
          "bg-volt text-volt-foreground shadow-volt hover:shadow-volt-hover hover:-translate-y-0.5 active:translate-y-0 font-bold rounded-sm",
        
        // Destructive - Signal Red
        destructive:
          "bg-alert text-alert-foreground shadow-sm hover:bg-alert/90 active:bg-alert rounded-sm",
        
        // Outline - Ghost with border
        outline:
          "border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background rounded-sm",
        
        // Secondary - Fog background
        secondary:
          "bg-fog text-foreground shadow-sm hover:bg-ash active:bg-fog rounded-sm",
        
        // Ghost - Minimal
        ghost: 
          "text-foreground hover:bg-fog active:bg-ash rounded-sm",
        
        // Link style
        link: 
          "text-crypto underline-offset-4 hover:underline",
        
        // Crypto/STX actions - Cobalt
        crypto:
          "bg-crypto text-crypto-foreground shadow-md hover:bg-crypto/90 active:bg-crypto font-bold rounded-sm",
        
        // Hero CTA - For landing pages, extra large volt
        hero:
          "bg-volt text-volt-foreground shadow-volt hover:shadow-volt-hover hover:-translate-y-1 active:translate-y-0 font-display font-bold tracking-tight rounded-sm",
        
        // Alert/Danger action
        alert:
          "bg-alert text-alert-foreground shadow-md hover:bg-alert/90 font-bold rounded-sm",
      },
      size: {
        default: "h-12 px-6 py-3 text-base min-h-[48px] min-w-[48px]",
        sm: "h-10 px-4 py-2 text-sm min-h-[40px] min-w-[40px]",
        lg: "h-14 px-8 py-4 text-lg min-h-[56px]",
        xl: "h-16 px-10 py-5 text-xl min-h-[64px]",
        icon: "h-12 w-12 min-h-[48px] min-w-[48px]",
        "icon-sm": "h-10 w-10 min-h-[40px] min-w-[40px]",
        "icon-lg": "h-14 w-14 min-h-[56px] min-w-[56px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
