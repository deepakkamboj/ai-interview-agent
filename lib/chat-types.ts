export type MessageSource = "voice" | "text";
export type MessageRole = "user" | "assistant";

export interface SessionMessage {
  id: string;
  role: MessageRole;
  content: string;
  source: MessageSource;
  timestamp: Date;
}
