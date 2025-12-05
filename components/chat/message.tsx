"use client";

import type { SessionMessage } from "@/lib/chat-types";
import { cn } from "@/lib/utils";
import { Mic, User } from "lucide-react";

interface ChatMessageProps {
  message: SessionMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const label = isUser ? "You" : "AI Interviewer";
  const Icon = isUser ? User : Mic;

  return (
    <div
      className={cn("flex gap-3", isUser ? "flex-row-reverse text-right" : "")}
      data-role={message.role}
    >
      <div className="mt-1 shrink-0 rounded-full border border-border bg-card p-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div
        className={cn(
          "max-w-xl rounded-2xl border border-border/40 bg-muted/40 px-4 py-3 text-sm shadow-sm",
          isUser && "bg-primary text-primary-foreground border-transparent"
        )}
      >
        <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
          {label}
        </div>
        <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
        <div
          className={cn(
            "mt-2 text-[11px] uppercase tracking-wide text-muted-foreground/70",
            isUser && "text-primary-foreground/80"
          )}
        >
          {message.source === "voice" ? "Voice" : "Text"} •{" "}
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
