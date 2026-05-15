/**
 * Chain Context — Manages active blockchain (Stacks or Solana)
 * Provides chain switching, wallet state, and balance info across the app
 */

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export type ChainType = 'stacks' | 'solana';

interface ChainContextType {
  activeChain: ChainType;
  setActiveChain: (chain: ChainType) => void;
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
  /** Set chain and wallet together (avoids stale activeChain when connecting Solana). */
  setWalletForChain: (chain: ChainType, address: string | null) => void;
  isConnected: boolean;
  disconnect: () => void;
  chainConfig: {
    name: string;
    symbol: string;
    icon: string;
    explorerBase: string;
    decimals: number;
  };
}

const CHAIN_CONFIGS = {
  stacks: {
    name: 'Stacks',
    symbol: 'STX',
    icon: '⛓️',
    explorerBase: 'https://explorer.hiro.so',
    decimals: 6,
  },
  solana: {
    name: 'Solana',
    symbol: 'LOOPIN',
    icon: '◎',
    explorerBase: 'https://explorer.solana.com',
    decimals: 9,
    tokenMint: 'GnPwqMJiHCVoQ1KrunqNz9JJV4jXh7cYjjLvue3zBAGS',
    bagsUrl: 'https://bags.fm/GnPwqMJiHCVoQ1KrunqNz9JJV4jXh7cYjjLvue3zBAGS',
  },
} as const;

const ChainContext = createContext<ChainContextType | undefined>(undefined);

export const ChainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeChain, setActiveChainState] = useState<ChainType>(() => {
    const saved = localStorage.getItem('loopin_active_chain');
    return (saved === 'stacks' || saved === 'solana') ? saved : 'solana';
  });

  const [walletAddress, setWalletAddressState] = useState<string | null>(() => {
    const chain = localStorage.getItem('loopin_active_chain') || 'solana';
    return localStorage.getItem(`loopin_wallet_${chain}`) || localStorage.getItem('loopin_wallet');
  });

  const setActiveChain = useCallback((chain: ChainType) => {
    setActiveChainState(chain);
    localStorage.setItem('loopin_active_chain', chain);

    // Load wallet for the selected chain
    const savedWallet = localStorage.getItem(`loopin_wallet_${chain}`);
    setWalletAddressState(savedWallet);
  }, []);

  const setWalletAddress = useCallback((address: string | null) => {
    setWalletAddressState(address);
    if (address) {
      localStorage.setItem(`loopin_wallet_${activeChain}`, address);
      localStorage.setItem('loopin_wallet', address);
    } else {
      localStorage.removeItem(`loopin_wallet_${activeChain}`);
      localStorage.removeItem('loopin_wallet');
    }
  }, [activeChain]);

  const setWalletForChain = useCallback((chain: ChainType, address: string | null) => {
    setActiveChainState(chain);
    localStorage.setItem('loopin_active_chain', chain);
    setWalletAddressState(address);
    if (address) {
      localStorage.setItem(`loopin_wallet_${chain}`, address);
      localStorage.setItem('loopin_wallet', address);
    } else {
      localStorage.removeItem(`loopin_wallet_${chain}`);
      localStorage.removeItem('loopin_wallet');
    }
  }, []);

  const disconnect = useCallback(() => {
    setWalletAddressState(null);
    localStorage.removeItem('loopin_wallet_stacks');
    localStorage.removeItem('loopin_wallet_solana');
    localStorage.removeItem('loopin_wallet');
    localStorage.removeItem('playerId');
  }, []);

  const isConnected = !!walletAddress;

  const chainConfig = CHAIN_CONFIGS[activeChain];

  return (
    <ChainContext.Provider
      value={{
        activeChain,
        setActiveChain,
        walletAddress,
        setWalletAddress,
        setWalletForChain,
        isConnected,
        disconnect,
        chainConfig,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};

export const useChain = (): ChainContextType => {
  const context = useContext(ChainContext);
  if (!context) {
    throw new Error('useChain must be used within a ChainProvider');
  }
  return context;
};
