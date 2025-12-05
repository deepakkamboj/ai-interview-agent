"use client";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChatDisplay } from "./chat-display";
import { MicSelector } from "./mic-selector";
import type { SessionMessage } from "@/lib/chat-types";
import {
  Volume2,
  Mic,
  Brain,
  Loader2,
  MessageCircle,
  Settings,
  Play,
  Square,
  RotateCcw,
  Code2,
  MicOff,
  SlidersHorizontal,
} from "lucide-react";

type SessionState = "idle" | "listening" | "speaking" | "thinking";

const formatElapsed = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const toTwoDigits = (value: number) => value.toString().padStart(2, "0");
  const base = `${toTwoDigits(minutes)}:${toTwoDigits(seconds)}`;
  return hours > 0 ? `${toTwoDigits(hours)}:${base}` : base;
};

interface InterviewViewProps {
  sessionState: SessionState;
  messages: SessionMessage[];
  currentTranscript: string;
  isLoading: boolean;
  isRecording: boolean;
  onMicChange: (deviceId: string) => void;
  isConnected: boolean;
  questionCount: number;
  elapsedMs: number;
  onStart: () => void;
  onEnd: () => void;
  onReset: () => void;
  onOpenSetup: () => void;
  onSwitchToCoding?: () => void;
  isMicMuted: boolean;
  onToggleMute: () => void;
}

export function InterviewView({
  sessionState,
  messages,
  currentTranscript,
  isLoading,
  isRecording,
  onMicChange,
  isConnected,
  questionCount,
  elapsedMs,
  onStart,
  onEnd,
  onReset,
  onOpenSetup,
  onSwitchToCoding,
  isMicMuted,
  onToggleMute,
}: InterviewViewProps) {
  const layoutRef = useRef<HTMLDivElement | null>(null);
  const [isMicDialogOpen, setMicDialogOpen] = useState(false);

  useEffect(() => {
    if (layoutRef.current) {
      layoutRef.current.style.scrollMarginTop = "0px";
    }
  }, []);

  const getStatusCard = () => {
    switch (sessionState) {
      case "listening":
        return {
          icon: Mic,
          text: "Listening to your response...",
          bgColor: "bg-accent/25 border-accent/40",
          textColor: "text-accent-foreground",
          dotColor: "bg-listening",
        };
      case "speaking":
        return {
          icon: Volume2,
          text: "AI is speaking...",
          bgColor: "bg-primary/20 border-primary/40",
          textColor: "text-primary",
          dotColor: "bg-speaking",
        };
      case "thinking":
        return {
          icon: Brain,
          text: "Processing your response...",
          bgColor: "bg-secondary/70 border-secondary",
          textColor: "text-secondary-foreground",
          dotColor: "bg-cappuccino",
        };
      default:
        return {
          icon: MessageCircle,
          text: "Idle",
          bgColor: "bg-muted border-border",
          textColor: "text-muted-foreground",
          dotColor: "bg-idle",
        };
    }
  };

  const statusInfo = getStatusCard();
  const StatusIcon = statusInfo.icon;
  const showStatusCard = isConnected || messages.length > 0;
  const canStart = !isConnected && !isLoading;
  const canEnd = isConnected && !isLoading;
  const mainActionLabel = isConnected ? "End Interview" : "Start Interview";
  const mainActionDisabled = isConnected ? !canEnd : !canStart;
  const handleMainAction = isConnected ? onEnd : onStart;
  const mainActionIcon = isConnected ? Square : Play;
  const handleMicSelection = (deviceId: string) => {
    onMicChange(deviceId);
  };
  const controlsRow = (
    <>
      <div className="flex flex-wrap items-center justify-center gap-3 w-full">
        <Button
          onClick={handleMainAction}
          size="lg"
          className={
            isConnected
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : undefined
          }
          variant={isConnected ? "destructive" : "default"}
          disabled={mainActionDisabled}
          title={mainActionLabel}
        >
          {mainActionIcon === Play ? (
            <Play className="w-5 h-5" />
          ) : (
            <Square className="w-4 h-4" />
          )}
          {mainActionLabel}
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          className="flex-1 min-w-[10rem] gap-2 bg-transparent"
          size="lg"
          disabled={isLoading}
          title="Reset interview session"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        <Button
          variant={isMicMuted ? "destructive" : "outline"}
          size="icon"
          className="flex-none"
          aria-label={isMicMuted ? "Unmute microphone" : "Mute microphone"}
          onClick={onToggleMute}
          title={isMicMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {isMicMuted ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="flex-none"
          aria-label="Select microphone device"
          onClick={() => setMicDialogOpen(true)}
          title="Open MIC settings"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="flex-none"
          aria-label="Open setup configuration"
          onClick={onOpenSetup}
          title="Open setup configuration"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </>
  );

  return (
    <>
      <Dialog open={isMicDialogOpen} onOpenChange={setMicDialogOpen}>
        <DialogContent className="max-w-xl sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Select Microphone</DialogTitle>
          </DialogHeader>
          <MicSelector
            onMicChange={handleMicSelection}
            isRecording={!isMicMuted && isRecording}
          />
        </DialogContent>
      </Dialog>

      <div
        ref={layoutRef}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2 mb-6 max-w-7xl mx-auto px-6"
      >
        {/* Main Chat Area */}
        <div className="lg:col-span-2 space-y-4">
          {isConnected ? (
            <Card className="border-2 border-dashed border-accent/40 bg-background p-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <h2 className="text-xl font-semibold text-foreground">
                  Interview In Progress
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  Monitor your session and use the controls below to end or
                  reset when needed.
                </p>

                {showStatusCard && (
                  <div
                    className={`w-full rounded-lg border-2 px-4 py-2 flex flex-col gap-2 text-left ${statusInfo.bgColor}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          statusInfo.dotColor
                        } ${sessionState !== "idle" ? "animate-pulse" : ""}`}
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <StatusIcon
                          className={`w-5 h-5 ${statusInfo.textColor}`}
                        />
                        <span
                          className={`text-base font-semibold leading-tight ${statusInfo.textColor}`}
                        >
                          {statusInfo.text}
                        </span>
                      </div>
                      {isLoading && (
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </div>
                )}

                {currentTranscript && (
                  <div className="w-full rounded-md border border-dashed border-border/60 bg-muted/40 px-4 py-2 text-left">
                    <p className="text-sm text-muted-foreground">
                      Recording:
                      <span className="ml-2 font-medium text-foreground">
                        {currentTranscript}
                      </span>
                    </p>
                  </div>
                )}

                {controlsRow}

                {isConnected && questionCount >= 3 && (
                  <Button
                    onClick={onSwitchToCoding}
                    className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700"
                    size="lg"
                  >
                    <Code2 className="w-4 h-4" />
                    Start Coding Round
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <Card className="border-2 border-dashed border-accent/40 bg-background p-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <h2 className="text-xl font-semibold text-foreground">
                  Ready to Start Your Interview?
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  Click the button below to begin your AI-powered interview
                  session.
                </p>
                {controlsRow}
              </div>
            </Card>
          )}

          {/* Chat Display */}
          <div className="flex-1">
            <ChatDisplay messages={messages} isLoading={isLoading} />
          </div>
        </div>

        {/* Right Sidebar: Controls */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-20 space-y-6">
            {/* Session Stats */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Session Stats
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Messages:</span>
                  <span className="font-medium">{messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Questions Asked:
                  </span>
                  <span className="font-medium">{questionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Elapsed Time:</span>
                  <span className="font-mono font-medium">
                    {formatElapsed(elapsedMs)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span
                    className={`font-medium ${
                      isConnected ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    {isConnected ? "Active" : "Ready"}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
