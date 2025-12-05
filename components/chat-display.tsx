"use client";

import type { SessionMessage } from "@/lib/chat-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageList } from "@/components/chat/message-list";

interface ChatDisplayProps {
  messages: SessionMessage[];
  isLoading: boolean;
}

export function ChatDisplay({ messages, isLoading }: ChatDisplayProps) {
  return (
    <Card className="h-[28rem] bg-card md:h-[34rem] lg:h-[38rem]">
      <CardHeader className="border-border border-b pb-4">
        <CardTitle className="text-lg font-semibold">
          Interview Conversation
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-col px-0">
        <MessageList messages={messages} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}
