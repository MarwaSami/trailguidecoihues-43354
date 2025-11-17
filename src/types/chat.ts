export type ChatResponse = {
  file: Blob;
  senderScript: string;
  receviedScript: string;
};

export type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  audioUrl?: string;
  timestamp: number;
};