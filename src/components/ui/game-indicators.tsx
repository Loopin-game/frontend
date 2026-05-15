import React from 'react';
import { cn } from '@/lib/utils';

interface GPSMarkerProps {
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

export const GPSMarker: React.FC<GPSMarkerProps> = ({
  size = 'md',
  pulse = true,
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn("relative", className)}>
      {/* Pulse ring */}
      {pulse && (
        <div 
          className={cn(
            "absolute inset-0 rounded-full bg-volt/30 animate-pulse-ring",
            sizeClasses[size]
          )}
        />
      )}
      
      {/* Core marker */}
      <div 
        className={cn(
          "relative rounded-full bg-volt shadow-marker",
          sizeClasses[size],
          pulse && "animate-gps-pulse"
        )}
      >
        {/* Inner dot */}
        <div className="absolute inset-[25%] rounded-full bg-foreground" />
      </div>
    </div>
  );
};

interface StatusIndicatorProps {
  status: 'live' | 'waiting' | 'ended';
  label?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  className,
}) => {
  const statusConfig = {
    live: {
      color: 'bg-alert',
      text: 'LIVE',
      animate: true,
    },
    waiting: {
      color: 'bg-warning',
      text: 'WAITING',
      animate: false,
    },
    ended: {
      color: 'bg-muted-foreground',
      text: 'ENDED',
      animate: false,
    },
  };

  const config = statusConfig[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div className={cn(
          "w-2.5 h-2.5 rounded-full",
          config.color,
          config.animate && "animate-pulse"
        )} />
        {config.animate && (
          <div className={cn(
            "absolute inset-0 rounded-full animate-ping",
            config.color,
            "opacity-75"
          )} />
        )}
      </div>
      <span className="text-body-sm font-semibold">
        {label || config.text}
      </span>
    </div>
  );
};

interface SignalStrengthProps {
  strength: 'weak' | 'medium' | 'strong';
  label?: string;
  className?: string;
}

export const SignalStrength: React.FC<SignalStrengthProps> = ({
  strength,
  label,
  className,
}) => {
  const bars = {
    weak: 1,
    medium: 2,
    strong: 3,
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-end gap-0.5 h-4">
        {[1, 2, 3].map((bar) => (
          <div
            key={bar}
            className={cn(
              "w-1 rounded-full transition-colors",
              bar <= bars[strength] ? "bg-foreground" : "bg-muted",
            )}
            style={{ height: `${bar * 33}%` }}
          />
        ))}
      </div>
      <span className="text-body-sm font-medium">
        {label || `GPS: ${strength.toUpperCase()}`}
      </span>
    </div>
  );
};

export default GPSMarker;
