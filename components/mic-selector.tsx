"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mic, MicOff } from "lucide-react";
import {
  readJsonStorage,
  writeJsonStorage,
  removeStorageKey,
} from "@/lib/local-storage";
import { Button } from "@/components/ui/button";

interface MicSelectorProps {
  onMicChange: (deviceId: string) => void;
  isRecording: boolean;
}

export function MicSelector({ onMicChange, isRecording }: MicSelectorProps) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const storageKey = "ai-interview-selected-mic";
  const isMountedRef = useRef(false);
  const onMicChangeRef = useRef(onMicChange);
  const selectedDeviceRef = useRef<string>("");

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    onMicChangeRef.current = onMicChange;
  }, [onMicChange]);

  useEffect(() => {
    selectedDeviceRef.current = selectedDeviceId;
  }, [selectedDeviceId]);

  const applySelection = useCallback(
    (audioInputs: MediaDeviceInfo[]) => {
      if (!audioInputs.length || !isMountedRef.current) {
        setSelectedDeviceId("");
        selectedDeviceRef.current = "";
        removeStorageKey(storageKey);
        onMicChangeRef.current("");
        return;
      }

      const storedDeviceId = readJsonStorage<string>(storageKey);
      const currentSelection = selectedDeviceRef.current;

      const candidate =
        (storedDeviceId &&
          audioInputs.find((device) => device.deviceId === storedDeviceId)) ||
        (currentSelection &&
          audioInputs.find((device) => device.deviceId === currentSelection)) ||
        audioInputs[0];

      if (!candidate) {
        return;
      }

      if (candidate.deviceId !== currentSelection) {
        setSelectedDeviceId(candidate.deviceId);
        selectedDeviceRef.current = candidate.deviceId;
        onMicChangeRef.current(candidate.deviceId);
        writeJsonStorage(storageKey, candidate.deviceId);
      }
    },
    [storageKey]
  );

  const enumerateAudioInputs = useCallback(async () => {
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    return allDevices.filter((device) => device.kind === "audioinput");
  }, []);

  const loadDevices = useCallback(async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.enumerateDevices
    ) {
      if (isMountedRef.current) {
        setError("Microphone selection is not supported in this browser.");
        setDevices([]);
        setIsLoading(false);
      }
      return;
    }

    try {
      let audioInputs = await enumerateAudioInputs();
      if (!isMountedRef.current) {
        return;
      }

      setDevices(audioInputs);

      if (!audioInputs.length) {
        setError("No microphones detected. Connect a mic and try again.");
        applySelection(audioInputs);
        return;
      }

      setError(null);
      applySelection(audioInputs);

      const hasNamedDevices = audioInputs.some(
        (device) => device.label && device.label.trim().length > 0
      );

      if (!hasNamedDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          try {
            audioInputs = await enumerateAudioInputs();
            if (!isMountedRef.current) {
              return;
            }
            setDevices(audioInputs);
            applySelection(audioInputs);
            setError(null);
          } finally {
            stream.getTracks().forEach((track) => track.stop());
          }
        } catch (permissionError) {
          if (!isMountedRef.current) {
            return;
          }
          console.warn("Microphone permission not granted:", permissionError);
          if (
            permissionError instanceof DOMException &&
            (permissionError.name === "NotAllowedError" ||
              permissionError.name === "SecurityError")
          ) {
            setError(
              "Microphone permission is blocked. Allow access in your browser settings to see device names."
            );
          }
        }
      }
    } catch (error) {
      if (!isMountedRef.current) {
        return;
      }
      console.error("Error accessing microphone:", error);
      setDevices([]);
      setError(
        error instanceof DOMException && error.name === "NotAllowedError"
          ? "Microphone access was blocked. Enable permission and try again."
          : "Unable to enumerate microphones. Check browser permissions and hardware."
      );
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [applySelection, enumerateAudioInputs]);

  useEffect(() => {
    void loadDevices();

    const handleDeviceChange = () => {
      if (!isMountedRef.current) {
        return;
      }
      setIsLoading(true);
      setError(null);
      void loadDevices();
    };

    navigator.mediaDevices?.addEventListener?.(
      "devicechange",
      handleDeviceChange
    );

    return () => {
      navigator.mediaDevices?.removeEventListener?.(
        "devicechange",
        handleDeviceChange
      );
    };
  }, [loadDevices]);

  const handleMicChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    selectedDeviceRef.current = deviceId;
    onMicChange(deviceId);
    writeJsonStorage(storageKey, deviceId);
  };

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading microphones...
      </div>
    );
  }

  if (error && devices.length === 0) {
    return (
      <div className="flex flex-col gap-3 p-4 bg-card border border-border rounded-lg">
        <div className="text-sm text-destructive">{error}</div>
        <Button
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => {
            setIsLoading(true);
            setError(null);
            void loadDevices();
          }}
        >
          Retry Detection
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-2">
        {isRecording ? (
          <Mic className="w-5 h-5 text-green-500" />
        ) : (
          <MicOff className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Select
          value={selectedDeviceId}
          onValueChange={handleMicChange}
          disabled={!devices.length}
        >
          <SelectTrigger className="min-w-[16rem]">
            <SelectValue placeholder="Select microphone" />
          </SelectTrigger>
          <SelectContent>
            {devices.map((device, index) => (
              <SelectItem
                key={device.deviceId || index}
                value={device.deviceId}
              >
                {device.label?.trim().length
                  ? device.label
                  : `Microphone ${index + 1}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-xs text-amber-600 max-w-xs">{error}</p>}
      </div>
    </div>
  );
}
