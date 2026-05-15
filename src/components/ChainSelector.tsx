/**
 * ChainSelector — Toggle between Stacks and Solana networks
 * Appears in the navbar/header area
 */

import React from 'react';
import { useChain, ChainType } from '@/lib/chain-context';
import { cn } from '@/lib/utils';

interface ChainSelectorProps {
  className?: string;
  compact?: boolean;
}

const CHAINS: { id: ChainType; name: string; icon: string; color: string }[] = [
  { id: 'solana', name: 'Solana', icon: '◎', color: '#9945FF' },
  { id: 'stacks', name: 'Stacks', icon: '⛓️', color: '#5546FF' },
];

const ChainSelector: React.FC<ChainSelectorProps> = ({ className, compact = false }) => {
  const { activeChain, setActiveChain, isConnected } = useChain();

  return (
    <div
      className={cn(
        'flex items-center gap-1 p-1 rounded-full bg-black/5 backdrop-blur-sm border border-black/10',
        className
      )}
    >
      {CHAINS.map((chain) => {
        const isActive = activeChain === chain.id;
        return (
          <button
            key={chain.id}
            onClick={() => {
              if (isConnected) {
                const confirmed = window.confirm(
                  `Switch to ${chain.name}? You may need to reconnect your wallet.`
                );
                if (!confirmed) return;
              }
              setActiveChain(chain.id);
            }}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-white text-black shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            )}
            style={isActive ? { boxShadow: `0 0 12px ${chain.color}20` } : undefined}
          >
            <span className="text-base">{chain.icon}</span>
            {!compact && <span>{chain.name}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default ChainSelector;
