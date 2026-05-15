/**
 * Stacks transaction utilities
 * Handles STX transfers and contract calls
 */

import {
    makeSTXTokenTransfer,
    makeContractCall,
    broadcastTransaction,
    AnchorMode,
    PostConditionMode,
    stringUtf8CV,
    uintCV,
    principalCV,
} from '@stacks/transactions';
import { openContractCall, openSTXTransfer } from '@stacks/connect';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import { getCurrentNetwork } from './network-utils';
import { userSession } from './stacks-auth';

/**
 * Get the correct Stacks network
 */
function getNetwork() {
    const network = getCurrentNetwork();
    return network === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
}

/**
 * Pay entry fee to join a game
 */
export async function payEntryFee(
    gameId: string,
    entryFeeSTX: number,
    contractAddress: string,
    contractName: string
): Promise<{ success: boolean; txId?: string; error?: string }> {
    return new Promise((resolve) => {
        if (!userSession.isUserSignedIn()) {
            resolve({ success: false, error: 'Wallet not connected' });
            return;
        }

        const network = getNetwork();

        console.log('[Transaction] Paying entry fee:', entryFeeSTX, 'STX');

        // Convert STX to micro-STX (1 STX = 1,000,000 micro-STX)
        const amountMicroSTX = Math.floor(entryFeeSTX * 1000000);

        openContractCall({
            contractAddress,
            contractName,
            functionName: 'join-game',
            functionArgs: [
                // Ensure gameId is a valid integer
                (() => {
                    const idInt = parseInt(gameId);
                    if (isNaN(idInt)) {
                        console.error('[Transaction] Invalid game ID (not an integer):', gameId);
                        throw new Error(`Invalid game ID: ${gameId}. Expected an integer.`);
                    }
                    console.log('[Transaction] Using game ID for contract:', idInt);
                    return uintCV(idInt);
                })(),
            ],
            network,
            appDetails: {
                name: 'Loopin',
                icon: window.location.origin + '/logo.svg',
            },
            onFinish: (data) => {
                console.log('[Transaction] ✅ Success! TX ID:', data.txId);
                resolve({ success: true, txId: data.txId });
            },
            onCancel: () => {
                console.log('[Transaction] User cancelled');
                resolve({ success: false, error: 'User cancelled transaction' });
            },
        });
    });
}

/**
 * Send STX to an address (simple transfer)
 */
/**
 * Send STX to an address (simple transfer)
 */
export async function sendSTX(
    recipientAddress: string,
    amountSTX: number,
    memo?: string
): Promise<{ success: boolean; txId?: string; error?: string }> {
    return new Promise((resolve) => {
        if (!userSession.isUserSignedIn()) {
            resolve({ success: false, error: 'Wallet not connected' });
            return;
        }

        const network = getNetwork();
        const amountMicroSTX = Math.floor(amountSTX * 1000000);

        openSTXTransfer({
            recipient: recipientAddress,
            amount: JSON.stringify(amountMicroSTX), // openSTXTransfer expects string sometimes, but types might say number. Safe to pass logic. Actually types say string or number.
            memo,
            network,
            appDetails: {
                name: 'Loopin',
                icon: window.location.origin + '/logo.svg',
            },
            onFinish: (data) => {
                console.log('[Transaction] ✅ Success! TX ID:', data.txId);
                resolve({ success: true, txId: data.txId });
            },
            onCancel: () => {
                resolve({ success: false, error: 'User cancelled transaction' });
            },
        });
    });
}

/**
 * Get transaction status
 */
export async function getTransactionStatus(txId: string): Promise<{
    status: 'pending' | 'success' | 'failed';
    details?: any;
}> {
    try {
        const network = getCurrentNetwork();
        const apiUrl = network === 'mainnet'
            ? 'https://api.mainnet.hiro.so'
            : 'https://api.testnet.hiro.so';

        const response = await fetch(`${apiUrl}/extended/v1/tx/${txId}`);
        const data = await response.json();

        if (data.tx_status === 'success') {
            return { status: 'success', details: data };
        } else if (data.tx_status === 'pending') {
            return { status: 'pending', details: data };
        } else {
            return { status: 'failed', details: data };
        }
    } catch (error) {
        console.error('[Transaction] Error checking status:', error);
        return { status: 'pending' };
    }
}