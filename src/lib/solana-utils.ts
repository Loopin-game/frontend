/**
 * Solana blockchain utilities
 * Handles SOL and $LOOPIN SPL token interactions
 */

import { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js';

const SOLANA_NETWORK = import.meta.env.VITE_SOLANA_NETWORK || 'mainnet-beta';
const LOOPIN_TOKEN_MINT = import.meta.env.VITE_LOOPIN_TOKEN_MINT || 'GnPwqMJiHCVoQ1KrunqNz9JJV4jXh7cYjjLvue3zBAGS';

export function getConnection(): Connection {
  const rpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl(SOLANA_NETWORK as any);
  return new Connection(rpcUrl, 'confirmed');
}

export function getLoopinMint(): PublicKey {
  return new PublicKey(LOOPIN_TOKEN_MINT);
}

export async function getSOLBalance(address: string): Promise<{
  balance: number;
  lamports: number;
}> {
  try {
    const connection = getConnection();
    const pubkey = new PublicKey(address);
    const lamports = await connection.getBalance(pubkey);
    const balance = lamports / LAMPORTS_PER_SOL;
    return { balance, lamports };
  } catch (error) {
    console.error('[SOL Balance] Error:', error);
    return { balance: 0, lamports: 0 };
  }
}

/**
 * Get $LOOPIN SPL token balance for an address
 */
export async function getLoopinTokenBalance(address: string): Promise<{
  balance: number;
  rawAmount: string;
}> {
  try {
    const connection = getConnection();
    const owner = new PublicKey(address);
    const mint = getLoopinMint();

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(owner, { mint });

    if (tokenAccounts.value.length === 0) {
      return { balance: 0, rawAmount: '0' };
    }

    const account = tokenAccounts.value[0].account.data.parsed.info;
    const balance = account.tokenAmount.uiAmount || 0;
    const rawAmount = account.tokenAmount.amount;

    return { balance, rawAmount };
  } catch (error) {
    console.error('[LOOPIN Balance] Error:', error);
    return { balance: 0, rawAmount: '0' };
  }
}

export async function getRecentTransactions(address: string, limit: number = 10) {
  try {
    const connection = getConnection();
    const pubkey = new PublicKey(address);
    const signatures = await connection.getSignaturesForAddress(pubkey, { limit });

    return signatures.map(sig => ({
      signature: sig.signature,
      slot: sig.slot,
      blockTime: sig.blockTime,
      status: sig.confirmationStatus,
      err: sig.err,
    }));
  } catch (error) {
    console.error('[SOL Transactions] Error:', error);
    return [];
  }
}

export function formatSOL(amount: number): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 9,
  });
}

export function formatLOOPIN(amount: number): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function getExplorerUrl(address: string): string {
  const cluster = SOLANA_NETWORK === 'mainnet-beta' ? '' : `?cluster=${SOLANA_NETWORK}`;
  return `https://explorer.solana.com/address/${address}${cluster}`;
}

export function getTxExplorerUrl(signature: string): string {
  const cluster = SOLANA_NETWORK === 'mainnet-beta' ? '' : `?cluster=${SOLANA_NETWORK}`;
  return `https://explorer.solana.com/tx/${signature}${cluster}`;
}

export function getBagsTokenUrl(): string {
  return `https://bags.fm/${LOOPIN_TOKEN_MINT}`;
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export function getCurrentNetwork(): string {
  return SOLANA_NETWORK;
}

export function shortenAddress(address: string, chars: number = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
