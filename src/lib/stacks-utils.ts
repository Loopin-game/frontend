/**
 * Stacks blockchain utilities
 * Fetches real data from Stacks blockchain
 */

import { getCurrentNetwork } from './network-utils';

const STACKS_API_MAINNET = 'https://api.mainnet.hiro.so';
const STACKS_API_TESTNET = 'https://api.testnet.hiro.so';

/**
 * Get the correct API URL for current network
 */
function getStacksApiUrl(): string {
    const network = getCurrentNetwork();
    return network === 'mainnet' ? STACKS_API_MAINNET : STACKS_API_TESTNET;
}

export async function getSTXBalance(address: string): Promise<{
    balance: number;
    locked: number;
    total: number;
}> {
    try {
        const apiUrl = getStacksApiUrl();
        const url = `${apiUrl}/extended/v1/address/${address}/balances`;

        console.log('[Balance] 🔍 Fetching balance for:', address);
        console.log('[Balance] 🌐 Network:', getCurrentNetwork());
        console.log('[Balance] 📡 API URL:', url);

        const response = await fetch(url);

        console.log('[Balance] 📊 Response status:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Balance] ❌ API Error:', errorText);
            throw new Error(`Failed to fetch balance: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[Balance] 📦 Raw data:', data);

        // Convert from micro-STX to STX (1 STX = 1,000,000 micro-STX)
        const balance = parseInt(data.stx.balance) / 1000000;
        const locked = parseInt(data.stx.locked) / 1000000;
        const total = balance + locked;

        console.log('[Balance] ✅ Parsed balance:', { balance, locked, total });

        return { balance, locked, total };
    } catch (error) {
        console.error('[Balance] ❌ Error fetching balance:', error);
        return { balance: 0, locked: 0, total: 0 };
    }
}

/**
 * Fetch account info including nonce
 */
export async function getAccountInfo(address: string): Promise<{
    balance: number;
    nonce: number;
    locked: number;
}> {
    try {
        const apiUrl = getStacksApiUrl();
        const response = await fetch(`${apiUrl}/v2/accounts/${address}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch account info: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            balance: parseInt(data.balance) / 1000000,
            nonce: data.nonce,
            locked: parseInt(data.locked) / 1000000
        };
    } catch (error) {
        console.error('[Blockchain] Error fetching account info:', error);
        return { balance: 0, nonce: 0, locked: 0 };
    }
}

/**
 * Fetch recent transactions for an address
 */
export async function getRecentTransactions(address: string, limit: number = 10) {
    try {
        const apiUrl = getStacksApiUrl();
        const response = await fetch(
            `${apiUrl}/extended/v1/address/${address}/transactions?limit=${limit}`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch transactions: ${response.statusText}`);
        }

        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('[Blockchain] Error fetching transactions:', error);
        return [];
    }
}

/**
 * Get network status
 */
export async function getNetworkStatus() {
    try {
        const apiUrl = getStacksApiUrl();
        const response = await fetch(`${apiUrl}/extended/v1/status`);

        if (!response.ok) {
            throw new Error(`Failed to fetch network status: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('[Blockchain] Error fetching network status:', error);
        return null;
    }
}

/**
 * Format STX amount with proper decimals
 */
export function formatSTX(amount: number): string {
    return amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
    });
}

/**
 * Get explorer URL for address
 */
export function getExplorerUrl(address: string): string {
    const network = getCurrentNetwork();
    const baseUrl = 'https://explorer.hiro.so';
    const chainParam = network === 'testnet' ? '?chain=testnet' : '';
    return `${baseUrl}/address/${address}${chainParam}`;
}

/**
 * Get explorer URL for transaction
 */
export function getTxExplorerUrl(txId: string): string {
    const network = getCurrentNetwork();
    const baseUrl = 'https://explorer.hiro.so';
    const chainParam = network === 'testnet' ? '?chain=testnet' : '';
    return `${baseUrl}/txid/${txId}${chainParam}`;
}
