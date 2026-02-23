import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../../../services/supabase';
import { GameState, GameStatus, Player, Bomb, TileType, GRID_WIDTH, GRID_HEIGHT } from './types';
import { generateGrid, getSafeSpawnPoint } from './utils';
import { AvatarConfig } from '../../../types';

export const useBombermanGame = (avatarConfig: AvatarConfig, schoolId?: string, onGameOver?: (score: number) => void) => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Refs for logic that needs latest state without re-render
    const stateRef = useRef<GameState | null>(null);
    stateRef.current = gameState;

    // Join or Create Game
    useEffect(() => {
        const joinGame = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const user = session?.user;
                if (!user) {
                    console.error("Bomberman Debug: No user found in session");
                    setError("Not authenticated");
                    return;
                }
                console.log("Bomberman Debug: User found", user.id);
                setMyPlayerId(user.id);

                // 1. Try to find an existing lobby with available slots
                const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
                const { data: lobbies } = await supabase
                    .from('bomberman_rooms')
                    .select('*')
                    .eq('status', 'lobby')
                    .gte('created_at', fiveMinutesAgo)
                    .order('created_at', { ascending: true })
                    .limit(10);

                let roomId: string | null = null;
                let playerIndex = 0;

                // Find a lobby with less than 4 players
                if (lobbies) {
                    for (const lobby of lobbies) {
                        const playerCount = Object.keys(lobby.players || {}).length;
                        if (playerCount < 4 && !lobby.players?.[user.id]) {
                            roomId = lobby.id;
                            playerIndex = playerCount;
                            console.log('Bomberman Debug: Found existing lobby', roomId, 'with', playerCount, 'players');
                            break;
                        }
                    }
                }

                // 2. If no suitable lobby found, create a new room
                if (!roomId) {
                    roomId = await createRoom();
                    playerIndex = 0;
                    console.log('Bomberman Debug: Created new room', roomId);
                }

                // 3. Add self to players
                const spawn = getSafeSpawnPoint(playerIndex);
                console.log('Bomberman Debug: Spawn point:', spawn, 'Player index:', playerIndex);

                const newPlayer: Player = {
                    id: user.id,
                    name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'Player',
                    avatar: avatarConfig,
                    x: spawn.x,
                    y: spawn.y,
                    isAlive: true,
                    lives: 3,
                    bombCount: 1,
                    blastRadius: 1,
                    speed: 1.0,
                    color: avatarConfig.shirtColor,
                    score: 0,
                    ready: true
                };

                // Fetch current room data to merge players
                const { data: roomData } = await supabase
                    .from('bomberman_rooms')
                    .select('players')
                    .eq('id', roomId)
                    .single();

                const currentPlayers = roomData?.players || {};
                const updatedPlayers = { ...currentPlayers, [user.id]: newPlayer };

                await supabase
                    .from('bomberman_rooms')
                    .update({ players: updatedPlayers as any })
                    .eq('id', roomId);

                // 4. Listen to room via Supabase Realtime
                const channel = supabase
                    .channel(`bomberman-room-${roomId}`)
                    .on('postgres_changes', {
                        event: '*',
                        schema: 'public',
                        table: 'bomberman_rooms',
                        filter: `id=eq.${roomId}`
                    }, async (payload) => {
                        const data = payload.new as any;
                        if (!data) return;
                        const parsedGrid = typeof data.grid === 'string' ? JSON.parse(data.grid) : data.grid;
                        const playerCount = Object.keys(data.players || {}).length;

                        setGameState({
                            id: data.id,
                            status: data.status,
                            grid: parsedGrid,
                            players: data.players || {},
                            bombs: data.bombs || {},
                            explosions: data.explosions || {},
                            createdAt: data.created_at ? new Date(data.created_at).getTime() : Date.now(),
                            winnerId: data.winner_id,
                            lobbyStartTime: data.lobby_start_time ? new Date(data.lobby_start_time).getTime() : undefined,
                            forceStarted: data.force_started,
                            forceStartedBy: data.force_started_by
                        });

                        // Set lobbyStartTime when 2nd player joins
                        if (data.status === 'lobby' && playerCount >= 2 && !data.lobby_start_time) {
                            await supabase
                                .from('bomberman_rooms')
                                .update({ lobby_start_time: new Date().toISOString() } as any)
                                .eq('id', roomId);
                        }

                        // Auto-start when 4 players join
                        if (data.status === 'lobby' && playerCount === 4) {
                            await supabase
                                .from('bomberman_rooms')
                                .update({ status: 'playing' })
                                .eq('id', roomId);
                        }
                    })
                    .subscribe();

                // Do an initial fetch to set state immediately
                const { data: initialRoom } = await supabase
                    .from('bomberman_rooms')
                    .select('*')
                    .eq('id', roomId)
                    .single();

                if (initialRoom) {
                    const parsedGrid = typeof initialRoom.grid === 'string' ? JSON.parse(initialRoom.grid as string) : initialRoom.grid;
                    setGameState({
                        id: initialRoom.id,
                        status: initialRoom.status as GameStatus,
                        grid: parsedGrid,
                        players: (initialRoom.players || {}) as Record<string, Player>,
                        bombs: (initialRoom.bombs || {}) as Record<string, Bomb>,
                        explosions: (initialRoom.explosions || {}) as Record<string, any>,
                        createdAt: initialRoom.created_at ? new Date(initialRoom.created_at).getTime() : Date.now(),
                        winnerId: (initialRoom as any).winner_id,
                        lobbyStartTime: (initialRoom as any).lobby_start_time ? new Date((initialRoom as any).lobby_start_time).getTime() : undefined,
                        forceStarted: (initialRoom as any).force_started,
                        forceStartedBy: (initialRoom as any).force_started_by
                    });
                }

                return () => {
                    supabase.removeChannel(channel);
                };
            } catch (err: any) {
                console.error("Join game error:", err);
                setError(err.message || "Failed to join game");
            }
        };

        const createRoom = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;
            if (!user) throw new Error("Not authenticated");

            const grid = generateGrid();
            const { data, error } = await supabase
                .from('bomberman_rooms')
                .insert({
                    status: 'lobby',
                    grid: JSON.stringify(grid),
                    players: {},
                    bombs: {},
                    school_id: schoolId,
                    created_by: user.id
                } as any)
                .select('id')
                .single();

            if (error) throw error;
            return data.id;
        };

        const cleanup = joinGame();
        return () => { };
    }, []);

    // Helper to update room
    const updateRoom = useCallback(async (roomId: string, updates: any) => {
        const { error } = await supabase
            .from('bomberman_rooms')
            .update(updates)
            .eq('id', roomId);
        if (error) console.error('Room update error:', error);
    }, []);

    // Actions
    const move = useCallback((x: number, y: number) => {
        if (!gameState || !myPlayerId) return;

        // For move, we need to merge with existing players
        const updatedPlayers = {
            ...gameState.players,
            [myPlayerId]: {
                ...gameState.players[myPlayerId],
                x,
                y
            }
        };

        updateRoom(gameState.id, { players: updatedPlayers });
    }, [gameState, myPlayerId, updateRoom]);

    const placeBomb = useCallback(() => {
        console.log('placeBomb called', { gameState: !!gameState, myPlayerId });
        if (!gameState || !myPlayerId) {
            console.log('placeBomb: No gameState or playerId');
            return;
        }
        const player = gameState.players[myPlayerId];
        if (!player || !player.isAlive) {
            console.log('placeBomb: Player not found or dead');
            return;
        }

        const myBombs = Object.values(gameState.bombs).filter(b => b.ownerId === myPlayerId);
        if (myBombs.length >= player.bombCount) {
            console.log('placeBomb: Max bombs reached', myBombs.length, '/', player.bombCount);
            return;
        }

        const bx = Math.floor(player.x);
        const by = Math.floor(player.y);
        console.log('placeBomb: Position', { x: player.x, y: player.y, bx, by });

        // Strict placement check: Only on empty floor or powerups (not walls/crates)
        const tile = gameState.grid[by]?.[bx];
        console.log('placeBomb: Tile at position', tile);
        if (tile === 'wall' || tile === 'crate') {
            console.log('placeBomb: Cannot place on', tile);
            return;
        }

        // Check if a bomb is already there
        const bombExists = Object.values(gameState.bombs).some(b => Math.floor(b.x) === bx && Math.floor(b.y) === by);
        if (bombExists) {
            console.log('placeBomb: Bomb already exists at position');
            return;
        }

        const bombId = `${Math.floor(Date.now())}_${myPlayerId}`;
        console.log('placeBomb: PLACING BOMB', bombId);

        const newBomb: Bomb = {
            id: bombId,
            x: bx,
            y: by,
            ownerId: myPlayerId,
            placedAt: Date.now(),
            expiresAt: Date.now() + 3000,
            radius: player.blastRadius
        };

        const updatedBombs = { ...gameState.bombs, [bombId]: newBomb };
        updateRoom(gameState.id, { bombs: updatedBombs });

        setTimeout(async () => {
            handleExplosion(gameState.id, newBomb);
        }, 3000);

    }, [gameState, myPlayerId, updateRoom]);

    const handleExplosion = async (roomId: string, bomb: Bomb) => {
        if (!stateRef.current) return;

        const currentGrid = [...stateRef.current.grid.map(row => [...row])];
        const updates: any = {};

        // Remove bomb
        const updatedBombs = { ...stateRef.current.bombs };
        delete updatedBombs[bomb.id];
        updates.bombs = updatedBombs;

        // Add visual explosion record
        const explosionId = bomb.id;
        const directions = [
            { name: 'down', dx: 0, dy: 1 },
            { name: 'up', dx: 0, dy: -1 },
            { name: 'right', dx: 1, dy: 0 },
            { name: 'left', dx: -1, dy: 0 }
        ];

        const explosionData: any = {
            x: bomb.x,
            y: bomb.y,
            radius: bomb.radius,
            createdAt: Date.now(),
            spans: { up: 0, down: 0, left: 0, right: 0 }
        };

        // Collect all affected tiles (including bomb center)
        const affectedTiles: { x: number, y: number }[] = [{ x: bomb.x, y: bomb.y }];

        for (const dir of directions) {
            for (let i = 1; i <= bomb.radius; i++) {
                const tx = bomb.x + dir.dx * i;
                const ty = bomb.y + dir.dy * i;

                if (tx < 0 || tx >= GRID_WIDTH || ty < 0 || ty >= GRID_HEIGHT) break;

                const tile = currentGrid[ty][tx];
                if (tile === 'wall') break; // Hard stop

                affectedTiles.push({ x: tx, y: ty });
                explosionData.spans[dir.name] = i;

                if (tile === 'crate') {
                    // Destroy crate and maybe spawn power-up (50% total chance)
                    const roll = Math.random();
                    if (roll < 0.20) {
                        currentGrid[ty][tx] = 'powerup_bomb';
                    } else if (roll < 0.38) {
                        currentGrid[ty][tx] = 'powerup_radius';
                    } else if (roll < 0.50) {
                        currentGrid[ty][tx] = 'powerup_speed';
                    } else {
                        currentGrid[ty][tx] = 'empty';
                    }
                    break; // Stop blast AFTER hitting crate
                }
            }
        }

        const updatedExplosions = { ...(stateRef.current.explosions || {}), [explosionId]: explosionData };
        updates.explosions = updatedExplosions;

        // Check if any players are hit
        const players = { ...stateRef.current.players };
        for (const playerId of Object.keys(players)) {
            const player = players[playerId];
            if (!player.isAlive) continue;

            const px = Math.floor(player.x);
            const py = Math.floor(player.y);

            const isHit = affectedTiles.some(t => t.x === px && t.y === py);
            if (isHit) {
                const currentLives = (player.lives || 1) - 1;
                players[playerId] = {
                    ...players[playerId],
                    lives: currentLives,
                    ...(currentLives <= 0 ? { isAlive: false } : {})
                };

                if (currentLives <= 0) {
                    console.log(`Player ${player.name} died!`);
                } else {
                    console.log(`Player ${player.name} hit! Lives left: ${currentLives}`);
                }
            }
        }
        updates.players = players;

        // Chain Reaction: Check if any other bombs are in affected tiles
        const otherBombs = Object.values(stateRef.current.bombs).filter(b => b.id !== bomb.id);
        for (const otherBomb of otherBombs) {
            const isHit = affectedTiles.some(t => t.x === Math.round(otherBomb.x) && t.y === Math.round(otherBomb.y));
            if (isHit) {
                console.log('Chain reaction! Triggering bomb:', otherBomb.id);
                setTimeout(() => handleExplosion(roomId, otherBomb), 50);
            }
        }

        updates.grid = JSON.stringify(currentGrid);

        await updateRoom(roomId, updates);
    };

    // Pickup Power-up
    const pickupPowerup = useCallback(async (x: number, y: number) => {
        if (!gameState || !myPlayerId) return;
        const tile = gameState.grid[y]?.[x];
        if (!tile || !tile.startsWith('powerup_')) return;

        const player = gameState.players[myPlayerId];
        if (!player) return;

        const updatedPlayers = { ...gameState.players };

        // Apply power-up effect
        if (tile === 'powerup_bomb') {
            updatedPlayers[myPlayerId] = { ...player, bombCount: (player.bombCount || 1) + 1 };
            console.log('Picked up BOMB power-up!');
        } else if (tile === 'powerup_radius') {
            updatedPlayers[myPlayerId] = { ...player, blastRadius: (player.blastRadius || 2) + 1 };
            console.log('Picked up RADIUS power-up!');
        } else if (tile === 'powerup_speed') {
            updatedPlayers[myPlayerId] = { ...player, speed: (player.speed || 1.0) + 0.2 };
            console.log('Picked up SPEED power-up!');
        }

        // Remove power-up from grid
        const newGrid = [...gameState.grid.map(row => [...row])];
        newGrid[y][x] = 'empty';

        await updateRoom(gameState.id, {
            players: updatedPlayers,
            grid: JSON.stringify(newGrid)
        });
    }, [gameState, myPlayerId, updateRoom]);

    const startGame = useCallback(async () => {
        if (!gameState) return;
        await updateRoom(gameState.id, { status: 'playing' });
    }, [gameState, updateRoom]);

    return {
        gameState,
        myPlayerId,
        move,
        placeBomb,
        pickupPowerup,
        startGame,
        error
    };
};
