import React from 'react';
import { cn } from '@/lib/utils';

interface SlideToEngageProps {
  onComplete: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const SlideToEngage: React.FC<SlideToEngageProps> = ({
  onComplete,
  label = "Slide to Start",
  disabled = false,
  className,
}) => {
  const [progress, setProgress] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const handleStart = React.useCallback((clientX: number) => {
    if (disabled) return;
    setIsDragging(true);
  }, [disabled]);

  const handleMove = React.useCallback((clientX: number) => {
    if (!isDragging || !trackRef.current || disabled) return;

    const track = trackRef.current.getBoundingClientRect();
    const sliderWidth = 56;
    const maxTravel = track.width - sliderWidth - 8;
    const newProgress = Math.max(0, Math.min(1, (clientX - track.left - sliderWidth / 2 - 4) / maxTravel));

    setProgress(newProgress);

    // Haptic feedback at threshold
    if (newProgress >= 0.8 && progress < 0.8) {
      if ('vibrate' in navigator) {
        navigator.vibrate(20);
      }
    }
  }, [isDragging, progress, disabled]);

  const handleEnd = React.useCallback(() => {
    setIsDragging(false);
    if (progress >= 0.9 && !disabled) {
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 50, 50]);
      }
      onComplete();
    }
    setProgress(0);
  }, [progress, onComplete, disabled]);

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
  const onTouchEnd = () => handleEnd();

  // Mouse handlers
  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onMouseUp = () => handleEnd();
  const onMouseLeave = () => {
    if (isDragging) handleEnd();
  };

  const translateX = React.useMemo(() => {
    if (!trackRef.current) return 0;
    const sliderWidth = 56;
    const maxTravel = trackRef.current.clientWidth - sliderWidth - 8;
    return progress * maxTravel;
  }, [progress]);

  return (
    <div
      ref={trackRef}
      className={cn(
        "relative w-full h-16 bg-fog rounded-full overflow-hidden select-none cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {/* Progress fill */}
      <div 
        className="absolute inset-y-0 left-0 bg-volt/20 transition-all duration-75"
        style={{ width: `${progress * 100}%` }}
      />
      
      {/* Slider thumb */}
      <div
        className={cn(
          "absolute top-1 left-1 w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-100",
          "bg-volt shadow-volt",
          progress >= 0.9 && "bg-success",
          isDragging && "scale-105"
        )}
        style={{ 
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        <svg 
          className="w-6 h-6 text-foreground" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2.5} 
            d="M14 5l7 7m0 0l-7 7m7-7H3" 
          />
        </svg>
      </div>
      
      {/* Label */}
      <span className={cn(
        "absolute inset-0 flex items-center justify-center font-semibold text-body-md text-slate pointer-events-none transition-opacity",
        progress > 0.3 && "opacity-50"
      )}>
        {label}
      </span>
    </div>
  );
};

export default SlideToEngage;
