"use client";

import { useEffect, useRef } from "react";
import type { SessionMessage } from "@/lib/chat-types";
import { siteConfig } from "@/lib/site-config";
import { ChatMessage } from "./message";
import { Loader2 } from "lucide-react";

interface MessageListProps {
  messages: SessionMessage[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  return (
    <div
      ref={containerRef}
      className="flex h-full flex-col gap-4 overflow-y-auto px-4 py-6"
    >
      {messages.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground">
          <p>{siteConfig.ui.emptyChatMessage}</p>
        </div>
      )}

      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          {siteConfig.ui.typingIndicatorLabel}
        </div>
      )}
    </div>
  );
}
