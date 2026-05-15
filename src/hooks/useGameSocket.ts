import { useEffect, useRef, useState, useCallback } from 'react';

export interface GameState {
    players: Array<{
        id: string;
        username: string;
        walletAddress: string;
        score: number;
        powerups?: string[];
    }>;
    trails: Array<{
        playerId: string;
        path: {
            type: string;
            coordinates: number[][]; // GeoJSON [lng, lat]
        };
    }>;
    territories: Array<{
        playerId: string;
        polygon: {
            type: string;
            coordinates: number[][][]; // GeoJSON [lng, lat] rings
        };
        area: number;
    }>;
}

export const useGameSocket = (gameId: string | undefined, playerId: string | null) => {
    const socketRef = useRef<WebSocket | null>(null);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [safePoints, setSafePoints] = useState<any[]>([]);

    useEffect(() => {
        if (!playerId || !gameId) return;

        // Clean up previous connection
        if (socketRef.current) {
            socketRef.current.close();
        }

        const wsUrl = import.meta.env.VITE_WS_URL || 'wss://loopin-k2ph.onrender.com';
        const ws = new WebSocket(`${wsUrl}/ws/game`);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("✅ Connected to Game Server");
            setIsConnected(true);

            // Send Join Message to set context
            ws.send(JSON.stringify({
                type: 'join_game_socket',
                gameId,
                playerId
            }));
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);

                switch (message.type) {
                    case 'init':
                        // Initial state on connection
                        setSafePoints(message.safePoints || []);
                        if (message.gameState) {
                            setGameState(message.gameState);
                        }
                        break;

                    case 'game_state_update':
                        setGameState(message.state);
                        break;

                    case 'territory_captured':
                        console.log(`🎉 Territory captured! Area: ${message.areaAdded} sqm`);
                        break;

                    case 'trail_severed':
                        // Immediately remove victim's trail from local state to reflect cut instantly
                        setGameState(prev => {
                            if (!prev) return prev;
                            return {
                                ...prev,
                                trails: prev.trails.filter(t => t.playerId !== message.victimId)
                            };
                        });

                        if (message.victimId === playerId) {
                            console.log('❌ Your trail was cut!');
                        }
                        break;

                    default:
                        // console.log('Unknown message type:', message.type);
                        break;
                }
            } catch (e) {
                console.error("WS Parse Error", e);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("Disconnected from Game Server");
            setIsConnected(false);
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [playerId, gameId]);

    const sendPosition = useCallback((lat: number, lng: number) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && playerId && gameId) {
            socketRef.current.send(JSON.stringify({
                type: 'position_update',
                playerId: playerId,
                gameId: gameId,
                lat,
                lng
            }));
        }
    }, [playerId, gameId]);

    const usePowerup = useCallback((powerupId: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && playerId && gameId) {
            socketRef.current.send(JSON.stringify({
                type: 'use_powerup',
                playerId: playerId,
                gameId: gameId,
                powerupId: powerupId
            }));
        }
    }, [playerId, gameId]);

    return {
        gameState,
        isConnected,
        sendPosition,
        usePowerup,
        safePoints
    };
};
