'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Phone, PhoneOff, RotateCcw, Settings, Download, Mic, Volume2, Brain } from 'lucide-react';

type SessionState = 'idle' | 'listening' | 'speaking' | 'thinking';

interface InterviewToolbarProps {
  isActive: boolean;
  sessionState: SessionState;
  questionCount: number;
  onStart: () => void;
  onEnd: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function InterviewToolbar({
  isActive,
  sessionState,
  questionCount,
  onStart,
  onEnd,
  onReset,
  isLoading = false,
}: InterviewToolbarProps) {
  const getStateIndicator = () => {
    switch (sessionState) {
      case 'listening':
        return (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            <Mic className="w-4 h-4" />
            <span className="text-sm font-medium">Listening</span>
          </div>
        );
      case 'speaking':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            <Volume2 className="w-4 h-4" />
            <span className="text-sm font-medium">Speaking</span>
          </div>
        );
      case 'thinking':
        return (
          <div className="flex items-center gap-2 text-purple-600">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
            <Brain className="w-4 h-4" />
            <span className="text-sm font-medium">Processing</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
            <span className="text-sm font-medium">Ready</span>
          </div>
        );
    }
  };

  return (
    <Card className="fixed top-0 left-0 right-0 bg-card border-b rounded-none z-50 shadow-lg">
      <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        {/* Left: Title and Status */}
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-bold">AI Interview Agent</h1>
            <p className="text-xs text-muted-foreground">
              Question {questionCount}
            </p>
          </div>
          <div className="w-px h-6 bg-border" />
          {getStateIndicator()}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          {isActive && (
            <div className="text-xs text-muted-foreground px-3 py-1 bg-muted rounded-full">
              {isLoading ? 'AI Processing...' : 'Session Active'}
            </div>
          )}

          {!isActive ? (
            <Button
              onClick={onStart}
              size="sm"
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Phone className="w-4 h-4" />
              Start
            </Button>
          ) : (
            <>
              <Button
                onClick={onReset}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <Button
                onClick={onEnd}
                size="sm"
                variant="destructive"
                className="gap-2"
              >
                <PhoneOff className="w-4 h-4" />
                End
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
