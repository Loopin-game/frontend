/**
 * AchievementPopup — Animated notification when a player unlocks an achievement
 */

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_blood', name: 'First Blood', description: 'Win your first game', icon: '🏆', rarity: 'common' },
  { id: 'territory_king', name: 'Territory King', description: 'Capture 10,000m² in one game', icon: '👑', rarity: 'epic' },
  { id: 'trail_cutter', name: 'Trail Cutter', description: 'Sever 10 opponent trails', icon: '⚔️', rarity: 'rare' },
  { id: 'streak_master', name: 'Streak Master', description: 'Win 3 games in a row', icon: '🔥', rarity: 'epic' },
  { id: 'city_champion', name: 'City Champion', description: 'Rank #1 in your city', icon: '🌟', rarity: 'legendary' },
  { id: 'high_roller', name: 'High Roller', description: 'Win 10 SOL in total', icon: '💰', rarity: 'epic' },
  { id: 'marathon_runner', name: 'Marathon Runner', description: 'Walk 10km in games', icon: '🏃', rarity: 'rare' },
  { id: 'ironclad', name: 'Ironclad', description: 'Use shield 20 times', icon: '🔒', rarity: 'rare' },
  { id: 'ghost_protocol', name: 'Ghost Protocol', description: 'Use stealth 10 times', icon: '👻', rarity: 'rare' },
  { id: 'sharpshooter', name: 'Sharpshooter', description: 'Sever trail within 10s of start', icon: '🎯', rarity: 'epic' },
  { id: 'globe_trotter', name: 'Globe Trotter', description: 'Play games in 3 different cities', icon: '🌍', rarity: 'epic' },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Capture territory in under 30s', icon: '⚡', rarity: 'rare' },
  { id: 'diamond_hands', name: 'Diamond Hands', description: 'Hold $LOOPIN for 7 days', icon: '💎', rarity: 'legendary' },
  { id: 'social_butterfly', name: 'Social Butterfly', description: 'Share 5 victories', icon: '📱', rarity: 'common' },
  { id: 'early_adopter', name: 'Early Adopter', description: 'Play during beta period', icon: '🚀', rarity: 'legendary' },
];

const RARITY_COLORS = {
  common: { bg: 'from-gray-500 to-gray-600', border: 'border-gray-400/30', text: 'text-gray-300' },
  rare: { bg: 'from-blue-500 to-blue-600', border: 'border-blue-400/30', text: 'text-blue-300' },
  epic: { bg: 'from-purple-500 to-violet-600', border: 'border-purple-400/30', text: 'text-purple-300' },
  legendary: { bg: 'from-[#D4FF00] to-[#00ff88]', border: 'border-[#D4FF00]/30', text: 'text-[#D4FF00]' },
};

interface AchievementPopupProps {
  achievement: Achievement;
  onClose: () => void;
  autoClose?: number; // ms
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({
  achievement,
  onClose,
  autoClose = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const colors = RARITY_COLORS[achievement.rarity];

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setIsVisible(true));

    // Auto close
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 400);
    }, autoClose);

    return () => clearTimeout(timer);
  }, [autoClose, onClose]);

  return (
    <div
      className={cn(
        'fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500',
        isVisible && !isExiting ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
      )}
    >
      <div
        className={cn(
          'relative bg-[#09090B] rounded-2xl border shadow-2xl overflow-hidden min-w-[320px]',
          colors.border
        )}
      >
        {/* Glow effect */}
        <div
          className={cn(
            'absolute inset-0 opacity-10 bg-gradient-to-r',
            colors.bg
          )}
        />

        {/* Content */}
        <div className="relative px-5 py-4 flex items-center gap-4">
          {/* Icon */}
          <div
            className={cn(
              'w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl shrink-0 shadow-lg',
              colors.bg
            )}
          >
            {achievement.icon}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 mb-0.5">
              Achievement Unlocked!
            </p>
            <p className="text-white font-bold text-base truncate">{achievement.name}</p>
            <p className="text-gray-400 text-xs mt-0.5">{achievement.description}</p>
          </div>

          {/* Close */}
          <button
            onClick={() => {
              setIsExiting(true);
              setTimeout(onClose, 400);
            }}
            className="text-gray-500 hover:text-white transition-colors p-1 shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Rarity badge */}
        <div className={cn('px-5 py-2 bg-white/5 flex items-center justify-between')}>
          <span className={cn('text-[10px] uppercase tracking-widest font-bold', colors.text)}>
            {achievement.rarity}
          </span>
          <span className="text-[10px] text-gray-500">
            +{achievement.rarity === 'legendary' ? 500 : achievement.rarity === 'epic' ? 200 : achievement.rarity === 'rare' ? 100 : 50} XP
          </span>
        </div>
      </div>
    </div>
  );
};

export default AchievementPopup;
