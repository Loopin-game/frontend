/**
 * ShareVictory — Social sharing component for game results
 * Generates shareable images and pre-filled social posts
 */

import React, { useState, useRef } from 'react';
import { Share2, Twitter, Download, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ShareVictoryProps {
  playerName: string;
  rank: number;
  totalPlayers: number;
  areaCaptured: number; // in m²
  prizeWon?: number; // in SOL
  city?: string;
  gameId?: string;
  className?: string;
}

const ShareVictory: React.FC<ShareVictoryProps> = ({
  playerName,
  rank,
  totalPlayers,
  areaCaptured,
  prizeWon,
  city,
  gameId,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isWinner = rank === 1;
  const gameLink = `https://loopin.fit${gameId ? `/game/${gameId}` : ''}`;

  const getRankEmoji = (r: number) => {
    switch (r) {
      case 1: return '🏆';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🎮';
    }
  };

  const getTweetText = () => {
    const lines = [
      `${getRankEmoji(rank)} ${isWinner ? 'I JUST WON' : `Ranked #${rank}`} in @LoopinGame! 🗺️`,
      '',
      `📐 Territory: ${areaCaptured.toFixed(1)}m² captured`,
      city ? `📍 City: ${city}` : '',
      prizeWon ? `💰 Prize: ${prizeWon.toFixed(4)} SOL` : '',
      `👥 Competed against ${totalPlayers - 1} players`,
      '',
      isWinner ? '🔥 Think you can beat me?' : '💪 Getting better every game!',
      '',
      gameLink,
      '',
      '#Loopin #Solana #BagsHackathon #GPS #GameFi',
    ];
    return lines.filter(Boolean).join('\n');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(getTweetText());
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(gameLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = gameLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#09090B',
        scale: 2,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `loopin-${isWinner ? 'victory' : 'result'}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'gap-2 font-bold transition-all duration-300',
          isWinner
            ? 'bg-[#D4FF00] hover:bg-[#b8dd00] text-black shadow-[0_0_20px_rgba(212,255,0,0.3)]'
            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
        )}
      >
        <Share2 size={16} />
        {isWinner ? 'Share Victory 🔥' : 'Share Result'}
      </Button>

      {/* Share Panel */}
      {isOpen && (
        <div className="absolute bottom-full mb-3 left-0 right-0 min-w-[320px] z-50 animate-in slide-in-from-bottom-4 duration-300">
          {/* Shareable Card Preview */}
          <div
            ref={cardRef}
            className="bg-[#09090B] rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-3"
          >
            {/* Header Gradient */}
            <div
              className="relative px-6 py-5"
              style={{
                background: isWinner
                  ? 'linear-gradient(135deg, #D4FF00 0%, #00ff88 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-70">
                    {isWinner ? 'VICTORY' : 'GAME RESULT'}
                  </p>
                  <p className="text-2xl font-black mt-1" style={{ color: isWinner ? '#09090B' : '#fff' }}>
                    {getRankEmoji(rank)} Rank #{rank}
                  </p>
                </div>
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black"
                  style={{
                    background: isWinner ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)',
                    color: isWinner ? '#09090B' : '#fff',
                  }}
                >
                  {playerName.slice(0, 2).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="px-6 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Territory Captured</span>
                <span className="text-white font-bold text-lg">{areaCaptured.toFixed(1)} m²</span>
              </div>
              {prizeWon !== undefined && prizeWon > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Prize Won</span>
                  <span className="text-[#D4FF00] font-bold text-lg">{prizeWon.toFixed(4)} SOL</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Players</span>
                <span className="text-white font-bold">{totalPlayers}</span>
              </div>
              {city && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">City</span>
                  <span className="text-white font-bold">{city}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#D4FF00]" />
                <span className="text-white/70 text-sm font-bold tracking-wider">LOOPIN</span>
              </div>
              <span className="text-white/30 text-xs">loopin.fit • Powered by Solana</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={handleShareTwitter}
              className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white gap-1.5 text-xs font-bold"
              size="sm"
            >
              <Twitter size={14} />
              Tweet
            </Button>
            <Button
              onClick={handleDownloadCard}
              className="bg-white/10 hover:bg-white/20 text-white gap-1.5 text-xs font-bold border border-white/10"
              size="sm"
            >
              <Download size={14} />
              Save
            </Button>
            <Button
              onClick={handleCopyLink}
              className={cn(
                'gap-1.5 text-xs font-bold border border-white/10 transition-all',
                copied
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              )}
              size="sm"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Link'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareVictory;
