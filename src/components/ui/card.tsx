import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-md border transition-all duration-300",
  {
    variants: {
      variant: {
        // Default card
        default: "bg-card text-card-foreground border-border shadow-sm",
        
        // Elevated with more shadow
        elevated: "bg-card text-card-foreground border-border shadow-md hover:shadow-lg hover:-translate-y-1",
        
        // Interactive card
        interactive: "bg-card text-card-foreground border-border shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer",
        
        // Feature card - for landing pages
        feature: "bg-card text-card-foreground border-border shadow-md hover:shadow-lg hover:-translate-y-2 hover:border-volt/30",
        
        // Stat card - for dashboard stats
        stat: "bg-card text-card-foreground border-border shadow-sm p-6",
        
        // Ghost - no border/shadow
        ghost: "bg-transparent border-transparent",
        
        // Outlined
        outline: "bg-transparent border-2 border-foreground",
        
        // Volt highlight
        volt: "bg-volt/5 border-volt/20 shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-display text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-base text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
