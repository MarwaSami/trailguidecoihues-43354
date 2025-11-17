import React from "react";
import { Card } from "@/components/ui/card";
import { Mic } from "lucide-react";
import { Message } from "@/types/chat";

interface ChatInterfaceProps {
  messages: Message[];
  isRecording: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isRecording }) => {
  return (
    <Card className="p-4 bg-card border-2 border-primary/10 shadow-lg h-[600px] overflow-hidden">
      <div className="h-full flex flex-col">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Mic className="w-5 h-5 text-primary" />
          Conversation
        </h3>
        
        <div className="flex-1 overflow-y-auto space-y-4 px-2 pb-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <Mic className="w-12 h-12 text-primary/20" />
              <p className="text-muted-foreground text-sm">
                No messages yet. Click the microphone button to start recording.
              </p>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`
                    max-w-[80%] p-4 rounded-2xl
                    ${msg.sender === "user" 
                      ? "bg-gradient-to-br from-primary/80 to-primary text-white" 
                      : "bg-gradient-to-br from-card to-muted border border-muted-foreground/10"}
                    shadow-lg hover:shadow-xl transition-shadow
                  `}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs font-medium ${msg.sender === "user" ? "text-white/90" : "text-muted-foreground"}`}>
                      {msg.sender === "user" ? "You" : "AI Assistant"}
                    </span>
                    <span className="text-[10px] opacity-50">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${msg.sender === "user" ? "text-white/90" : "text-foreground/90"}`}>
                    {msg.text}
                  </p>
                </div>
              </div>
            ))
          )}

          {isRecording && (
            <div className="sticky bottom-0 mt-4 p-3 bg-destructive/10 backdrop-blur-sm rounded-full flex items-center gap-2 justify-center border border-destructive/20 shadow-lg">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
              <span className="text-sm font-medium text-destructive">Recording in progress...</span>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Audio Player */}
      <div className="hidden">
        {messages.map(msg => msg.audioUrl && (
          <audio
            key={msg.id}
            src={msg.audioUrl}
            autoPlay
            onError={e => console.error("Audio play error:", e)}
          />
        ))}
      </div>
    </Card>
  );
};