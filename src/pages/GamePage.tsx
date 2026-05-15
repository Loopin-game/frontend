import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Polygon, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { Button } from '@/components/ui/button';
import {
  Flame,
  Navigation,
  X,
  Shield,
  Ghost
} from 'lucide-react';

import { DEFAULT_GAME_CONFIG } from '@/data/mockData';
import { useGameSocket } from '@/hooks/useGameSocket';
import { cn } from '@/lib/utils';
import { getLOOPINBagsUrl } from '@/lib/bags-api';

// --- ICONS & STYLES ---
const createPulseIcon = (color: string, isMe: boolean) => L.divIcon({
  className: 'custom-pulse-icon',
  html: `<div class="relative flex items-center justify-center">
            <div class="absolute w-4 h-4 rounded-full animate-ping opacity-75" style="background-color: ${color}"></div>
            <div class="relative w-3 h-3 rounded-full border-2 border-white shadow-lg" style="background-color: ${color}; transform: scale(${isMe ? 1.2 : 1.0})"></div>
         </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// Default start if geo permission denied
const DEFAULT_POS = DEFAULT_GAME_CONFIG.startPos;

const GamePage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  // Identity
  const playerId = localStorage.getItem('playerId');
  const [walletAddress] = useState(localStorage.getItem('loopin_wallet') || "");

  // Real Game State
  const { gameState, isConnected: wsConnected, sendPosition, usePowerup, safePoints } = useGameSocket(sessionId, playerId);

  // Local State
  const [timeLeft, setTimeLeft] = useState(DEFAULT_GAME_CONFIG.durationSeconds);
  const [myPos, setMyPos] = useState<[number, number]>(DEFAULT_POS);

  // --- REFS FOR EVENT LISTENERS ---
  // We use refs for mutable state accessed in event listeners to avoid re-binding them
  const myPosRef = useRef(myPos);
  const wsConnectedRef = useRef(wsConnected);

  // Sync refs
  useEffect(() => { myPosRef.current = myPos; }, [myPos]);
  useEffect(() => { wsConnectedRef.current = wsConnected; }, [wsConnected]);

  // --- DERIVED STATE (MEMOIZED) ---
  // No need to copy to local state via useEffect, just derive it.

  const otherPlayers = useMemo(() => {
    return (gameState?.players || []).filter(p => p.id !== playerId);
  }, [gameState, playerId]);

  const trails = useMemo(() => {
    return (gameState?.trails || []).map(t => ({
      id: t.playerId,
      isMe: t.playerId.toLowerCase() === (playerId || '').toLowerCase(),
      color: t.playerId.toLowerCase() === (playerId || '').toLowerCase() ? '#D4FF00' : '#FF0055',
      path: t.path.coordinates.map(c => [c[1], c[0]] as [number, number]) // Swap [lng, lat] -> [lat, lng]
    }));
  }, [gameState, playerId]);

  const territories = useMemo(() => {
    return (gameState?.territories || []).map(t => ({
      id: t.playerId,
      isMe: t.playerId.toLowerCase() === (playerId || '').toLowerCase(),
      color: t.playerId.toLowerCase() === (playerId || '').toLowerCase() ? '#D4FF00' : '#333333',
      path: t.polygon.coordinates[0].map(c => [c[1], c[0]] as [number, number]),
      area: t.area
    }));
  }, [gameState, playerId]);

  // Derived Stats
  const myStats = useMemo(() => {
    const myTrail = trails.find(t => t.isMe);
    const kcal = myTrail ? Math.floor(myTrail.path.length * 0.5) : 0;
    const myTotalArea = territories.filter(t => t.isMe).reduce((acc, t) => acc + t.area, 0);
    return { area: myTotalArea, kcal };
  }, [trails, territories]);

  const mapRef = useRef<L.Map | null>(null);

  // --- TIMER ---
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- KEYBOARD MOVEMENT (DEV) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 0.00002;
      let dLat = 0;
      let dLng = 0;

      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': dLat = step; break;
        case 'ArrowDown': case 's': case 'S': dLat = -step; break;
        case 'ArrowLeft': case 'a': case 'A': dLng = -step; break;
        case 'ArrowRight': case 'd': case 'D': dLng = step; break;
        default: return;
      }

      // Use Refs to get latest state without re-binding listener
      const currentPos = myPosRef.current;
      const newLat = currentPos[0] + dLat;
      const newLng = currentPos[1] + dLng;

      setMyPos([newLat, newLng]);

      if (wsConnectedRef.current) {
        // sendPosition is stable via useCallback now
        sendPosition(newLat, newLng);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sendPosition]); // Only re-bind if sendPosition changes (it shouldn't now)

  // --- POSITION TRACKING ---
  // ... (keep geolocation logic) ...

  // --- POSITION TRACKING ---
  useEffect(() => {
    let watchId: number | null = null;

    const startWatching = (highAccuracy: boolean) => {
      // Clear existing watch if any
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMyPos([latitude, longitude]);

          // Send to Backend
          if (wsConnected) {
            sendPosition(latitude, longitude);
          }
        },
        (err) => {
          console.warn(`Geolocation Error (${highAccuracy ? 'High' : 'Low'} Accuracy):`, err.message);

          // If high accuracy fails, try low accuracy
          if (highAccuracy) {
            console.log("Falling back to low accuracy...");
            startWatching(false);
          }
        },
        {
          enableHighAccuracy: highAccuracy,
          maximumAge: 5000,
          timeout: 10000
        }
      );
    };

    if (navigator.geolocation) {
      startWatching(true);
    }

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [wsConnected, sendPosition]);

  // Powerup State
  const [activePowerup, setActivePowerup] = useState<'shield' | 'invisibility' | null>(null);

  // Recenter Helper
  const Recenter = ({ pos }: { pos: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(pos);
    }, [pos, map]);
    return null;
  };

  const handlePowerupClick = (type: 'shield' | 'invisibility') => {
    setActivePowerup(type);
    usePowerup(type);
    // Reset visual state after mock duration or listen to backend
    setTimeout(() => setActivePowerup(null), 5000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Check Auth
  useEffect(() => {
    if (!playerId) {
      navigate('/register');
    }
  }, [playerId, navigate]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white font-sans text-black touch-none">

      {/* --- MAP LAYER (LIGHT) --- */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={myPos}
          zoom={18}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            maxZoom={20}
          />

          <Recenter pos={myPos} />

          {/* Territories */}
          {territories.map((terr, idx) => (
            <Polygon
              key={`terr-${idx}`}
              positions={terr.path}
              pathOptions={{
                color: terr.color,
                fillColor: terr.isMe ? '#D4FF00' : '#FF4444',
                fillOpacity: 0.4,
                weight: 1,
                stroke: false
              }}
            />
          ))}

          {/* Trails */}
          {trails.map((trail, idx) => (
            <Polyline
              key={`trail-${idx}`}
              positions={trail.path}
              pathOptions={{
                color: trail.isMe ? '#09090B' : trail.color,
                weight: trail.isMe ? 4 : 3,
                opacity: 0.8,
                lineCap: 'round'
              }}
            />
          ))}

          {/* Safe Points (if any) */}
          {safePoints.map((sp, idx) => (
            <Circle
              key={`sp-${idx}`}
              center={[sp.lat, sp.lng]}
              radius={sp.radius || 10}
              pathOptions={{ color: '#D4FF00', fillColor: 'transparent', dashArray: '5,5' }}
            />
          ))}

          {/* MINE Marker */}
          <Marker position={myPos} icon={createPulseIcon('#09090B', true)} />

          {/* OTHERS Markers (from WebSocket) */}
          {otherPlayers.map(p => {
            // Find this player's trail to get their current position
            // Use case-insensitive check
            const pTrail = trails.find(t => t.id.toLowerCase() === p.id.toLowerCase());

            // If we don't have a trail, we can't show them (unless we add a fallback position to player object)
            if (!pTrail || !pTrail.path || pTrail.path.length === 0) return null;

            // The last point in the path is their current position
            const currentPos = pTrail.path[pTrail.path.length - 1]; // [lat, lng]

            return (
              <Marker
                key={p.id}
                position={currentPos}
                icon={createPulseIcon(pTrail.color, false)}
              />
            );
          })}

        </MapContainer>
      </div>

      {/* --- TOP HUD --- */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 pt- safe-top">
        <div className="flex justify-between items-start">
          <Button
            size="icon"
            className="bg-[#D4FF00] hover:bg-[#b8dd00] text-black rounded-full shadow-[0_0_20px_rgba(212,255,0,0.3)] border border-[#09090B]/10 transition-transform active:scale-95 w-12 h-12"
            onClick={() => navigate('/dashboard')}
          >
            <X size={24} strokeWidth={2.5} />
          </Button>

          <div className="absolute top-16 right-4 bg-gray-800 text-white/50 text-xs px-2 py-1 rounded backdrop-blur">
            {wsConnected ? 'ONLINE' : 'CONNECTING...'}
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="bg-white/80 backdrop-blur-xl border border-black/5 px-6 py-2 rounded-2xl shadow-xl flex items-center gap-3">
              <div className={cn("w-2 h-2 rounded-full animate-pulse", wsConnected ? "bg-[#D4FF00]" : "bg-red-500")} />
              <span className="font-display text-2xl font-bold tracking-tight tabular-nums text-black">
                {formatTime(timeLeft)}
              </span>
            </div>
            <a
              href={getLOOPINBagsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold uppercase tracking-wider text-[#9945FF] hover:underline bg-white/70 px-2 py-0.5 rounded"
            >
              $LOOPIN on Bags
            </a>
          </div>

          <div className="flex items-center bg-white/80 backdrop-blur-md rounded-full px-3 py-1.5 border border-black/5 gap-2 shadow-sm">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border border-white bg-gray-200" />
              ))}
            </div>
            <span className="text-xs font-bold text-black">+{otherPlayers.length}</span>
          </div>
        </div>
      </div>

      {/* --- BOTTOM HUD --- */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-8 safe-bottom bg-gradient-to-t from-white/90 via-white/50 to-transparent">

        <div className="mb-4 flex justify-between items-end">
          <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-lg border-l-4 border-[#D4FF00] shadow-sm">
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider block">Territory</span>
            <span className="font-display text-2xl font-bold text-black">
              {myStats.area.toFixed(1)} <span className="text-sm text-gray-400">m²</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/90 backdrop-blur rounded-xl p-4 border border-black/5 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-gray-400">
                <Navigation size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Lat/Lng</span>
              </div>
              <div className="font-display text-sm font-bold text-black truncate">
                {myPos[0].toFixed(4)}, {myPos[1].toFixed(4)}
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur rounded-xl p-4 border border-black/5 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-gray-400">
                <Flame size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">KCAL</span>
              </div>
              <div className="font-display text-xl font-bold text-black">
                {myStats.kcal}
              </div>
            </div>
          </div>

          {/* Powerups Control Panel */}
          <div className="bg-black/80 backdrop-blur-xl p-2 rounded-[24px] border border-white/10 shadow-2xl flex items-center gap-2">

            {/* Shield */}
            <div className="relative group">
              <button
                onClick={() => handlePowerupClick('shield')}
                className={cn(
                  "w-14 h-14 md:w-16 md:h-16 rounded-[20px] flex items-center justify-center transition-all duration-300 relative overflow-hidden",
                  activePowerup === 'shield'
                    ? 'bg-[#D4FF00] text-black shadow-[0_0_15px_rgba(212,255,0,0.5)]'
                    : 'bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white'
                )}
              >
                <Shield
                  size={24}
                  strokeWidth={2.5}
                  className={`relative z-10 transition-transform duration-300`}
                />
              </button>
            </div>

            <div className="w-px h-8 bg-white/10" />

            {/* Stealth */}
            <div className="relative group">
              <button
                onClick={() => handlePowerupClick('invisibility')}
                className={cn(
                  "w-14 h-14 md:w-16 md:h-16 rounded-[20px] flex items-center justify-center transition-all duration-300 relative overflow-hidden",
                  activePowerup === 'invisibility'
                    ? 'bg-[#b794f4] text-black shadow-[0_0_15px_rgba(183,148,244,0.5)]'
                    : 'bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white'
                )}
              >
                <Ghost
                  size={24}
                  strokeWidth={2.5}
                  className={`relative z-10 transition-transform duration-300`}
                />
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default GamePage;
