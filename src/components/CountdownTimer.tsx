/**
 * CountdownTimer — Shows time until next scheduled tournament
 * Auto-updates every second with animated digits
 */

import React, { useState, useEffect } from 'react';
import { Timer, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  className?: string;
  compact?: boolean;
}

// Tournament times (every 2 hours starting at 10 AM IST)
const TOURNAMENT_HOURS = [10, 12, 14, 16, 18, 20];

function getNextTournamentTime(): Date {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Find next tournament hour
  for (const hour of TOURNAMENT_HOURS) {
    if (hour > currentHour || (hour === currentHour && currentMinute < 0)) {
      const next = new Date(now);
      next.setHours(hour, 0, 0, 0);
      return next;
    }
  }

  // If past all tournaments today, get first one tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(TOURNAMENT_HOURS[0], 0, 0, 0);
  return tomorrow;
}

function getTimeRemaining(targetDate: Date): {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const total = Math.max(0, targetDate.getTime() - Date.now());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor(total / (1000 * 60 * 60));

  return { hours, minutes, seconds, total };
}

const DigitBox: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="bg-black/80 backdrop-blur-xl rounded-lg px-2.5 py-1.5 min-w-[40px] text-center border border-white/10">
      <span className="text-white font-mono text-lg font-bold tabular-nums">{value}</span>
    </div>
    <span className="text-[9px] uppercase tracking-widest text-gray-500 mt-1 font-bold">{label}</span>
  </div>
);

const CountdownTimer: React.FC<CountdownTimerProps> = ({ className, compact = false }) => {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(getNextTournamentTime()));
  const [targetTime, setTargetTime] = useState(getNextTournamentTime());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getTimeRemaining(targetTime);
      setTimeRemaining(remaining);

      // If tournament time passed, get next one
      if (remaining.total <= 0) {
        const next = getNextTournamentTime();
        setTargetTime(next);
        setTimeRemaining(getTimeRemaining(next));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2 text-sm', className)}>
        <Timer size={14} className="text-[#D4FF00]" />
        <span className="font-mono font-bold text-white tabular-nums">
          {pad(timeRemaining.hours)}:{pad(timeRemaining.minutes)}:{pad(timeRemaining.seconds)}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('', className)}>
      <div className="flex items-center gap-2 mb-3">
        <Zap size={14} className="text-[#D4FF00]" />
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Next Tournament
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <DigitBox value={pad(timeRemaining.hours)} label="HRS" />
        <span className="text-white/30 font-bold text-lg mb-4">:</span>
        <DigitBox value={pad(timeRemaining.minutes)} label="MIN" />
        <span className="text-white/30 font-bold text-lg mb-4">:</span>
        <DigitBox value={pad(timeRemaining.seconds)} label="SEC" />
      </div>

      <p className="text-[10px] text-gray-500 mt-2">
        Tournaments at {TOURNAMENT_HOURS.map(h => `${h}:00`).join(', ')}
      </p>
    </div>
  );
};

export default CountdownTimer;
