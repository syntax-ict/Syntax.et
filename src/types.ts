export interface AssistantMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
