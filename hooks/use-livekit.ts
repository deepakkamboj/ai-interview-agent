import { useEffect, useRef, useState } from 'react';
import {
  LocalParticipant,
  Room,
  RoomOptions,
  RoomEvent,
  Participant,
  Track,
} from 'livekit-client';

interface UseLiveKitOptions {
  token: string;
  serverUrl: string;
}

export function useLiveKit(options: UseLifeKitOptions | null) {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const roomRef = useRef<Room | null>(null);

  useEffect(() => {
    if (!options) return;

    const connectToRoom = async () => {
      try {
        const { default: LiveKitClient } = await import('livekit-client');

        const room = new LiveKitClient.Room({
          audio: true,
          video: false,
        } as RoomOptions);

        roomRef.current = room;

        room.on(RoomEvent.ParticipantsChanged, () => {
          setParticipants(room.participants.values());
        });

        room.on(RoomEvent.Disconnected, () => {
          setIsConnected(false);
          setRoom(null);
        });

        room.on(RoomEvent.Connected, () => {
          setIsConnected(true);
        });

        await room.connect(options.serverUrl, options.token);
        setRoom(room);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Connection failed');
      }
    };

    connectToRoom();

    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
      }
    };
  }, [options]);

  return { room, participants, isConnected, error };
}
