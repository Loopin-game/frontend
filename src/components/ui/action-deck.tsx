import React from 'react';
import { cn } from '@/lib/utils';

interface ActionDeckProps {
  children: React.ReactNode;
  className?: string;
}

export const ActionDeck: React.FC<ActionDeckProps> = ({ children, className }) => {
  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-background rounded-t-lg p-6 shadow-deck z-50 animate-slide-up",
        className
      )}
    >
      {children}
    </div>
  );
};

interface ActionDeckContentProps {
  children: React.ReactNode;
  className?: string;
}

export const ActionDeckContent: React.FC<ActionDeckContentProps> = ({ children, className }) => {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  );
};

interface ActionDeckStatsProps {
  children: React.ReactNode;
  className?: string;
}

export const ActionDeckStats: React.FC<ActionDeckStatsProps> = ({ children, className }) => {
  return (
    <div className={cn("flex items-center justify-center gap-8", className)}>
      {children}
    </div>
  );
};

interface StatDisplayProps {
  value: string | number;
  label: string;
  variant?: 'default' | 'hero' | 'crypto';
  className?: string;
}

export const StatDisplay: React.FC<StatDisplayProps> = ({ 
  value, 
  label, 
  variant = 'default',
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <span className={cn(
        "font-display font-bold leading-none tracking-tight",
        variant === 'hero' && "text-display-xl",
        variant === 'crypto' && "text-heading-lg text-crypto",
        variant === 'default' && "text-heading-lg"
      )}>
        {value}
      </span>
      <span className="text-body-sm text-muted-foreground mt-1">
        {label}
      </span>
    </div>
  );
};

export default ActionDeck;
