import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, MoreVertical, Paperclip, Smile, Phone, Video } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  role: "freelancer" | "client";
}

const Chat = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [messageText, setMessageText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock conversations data
  const [conversations] = useState<Conversation[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      lastMessage: "That sounds great! When can we start?",
      timestamp: "2m ago",
      unread: 2,
      online: true,
      role: "client",
    },
    {
      id: 2,
      name: "Michael Chen",
      lastMessage: "I've reviewed your portfolio...",
      timestamp: "1h ago",
      unread: 0,
      online: true,
      role: "freelancer",
    },
    {
      id: 3,
      name: "Emma Williams",
      lastMessage: "Thanks for the update!",
      timestamp: "3h ago",
      unread: 0,
      online: false,
      role: "client",
    },
    {
      id: 4,
      name: "David Martinez",
      lastMessage: "Can you send me the files?",
      timestamp: "1d ago",
      unread: 1,
      online: false,
      role: "freelancer",
    },
  ]);

  // Mock messages data
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm interested in your services for my project.",
      sender: "other",
      timestamp: "10:30 AM",
      read: true,
    },
    {
      id: 2,
      text: "Hello! I'd be happy to help. Could you tell me more about the project?",
      sender: "user",
      timestamp: "10:32 AM",
      read: true,
    },
    {
      id: 3,
      text: "I need a full-stack developer for an e-commerce platform. It requires React and Node.js expertise.",
      sender: "other",
      timestamp: "10:35 AM",
      read: true,
    },
    {
      id: 4,
      text: "That sounds perfect! I have extensive experience with both technologies. What's your timeline?",
      sender: "user",
      timestamp: "10:37 AM",
      read: true,
    },
    {
      id: 5,
      text: "That sounds great! When can we start?",
      sender: "other",
      timestamp: "10:40 AM",
      read: false,
    },
  ]);

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: messageText,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: false,
      };
      setMessages([...messages, newMessage]);
      setMessageText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-8 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">Messages</h1>
            <p className="text-muted-foreground">Stay connected with clients and freelancers</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 h-[calc(100vh-240px)]">
            {/* CONVERSATIONS LIST */}
            <Card className="lg:col-span-4 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)] flex flex-col overflow-hidden">
              {/* Search */}
              <div className="p-4 border-b border-border/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50"
                  />
                </div>
              </div>

              {/* Conversations */}
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all hover:bg-muted/50 ${
                        selectedConversation === conv.id
                          ? "bg-primary/10 border border-primary/30"
                          : "border border-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                              {conv.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          {conv.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold truncate">{conv.name}</h3>
                            <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                            {conv.unread > 0 && (
                              <Badge className="bg-primary text-primary-foreground h-5 min-w-5 flex items-center justify-center px-1.5">
                                {conv.unread}
                              </Badge>
                            )}
                          </div>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {conv.role === "client" ? "Client" : "Freelancer"}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* CHAT AREA */}
            <Card className="lg:col-span-8 bg-background/40 backdrop-blur-xl border border-border/50 shadow-[var(--shadow-glass)] flex flex-col overflow-hidden">
              {selectedConv ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
                              {selectedConv.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          {selectedConv.online && (
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div>
                          <h2 className="font-semibold">{selectedConv.name}</h2>
                          <p className="text-xs text-muted-foreground">
                            {selectedConv.online ? "Active now" : "Offline"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <Video className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`flex items-end gap-2 max-w-[70%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className={message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}>
                                {message.sender === "user" 
                                  ? user?.username?.charAt(0).toUpperCase() || "U"
                                  : selectedConv.name.split(" ").map(n => n[0]).join("")
                                }
                              </AvatarFallback>
                            </Avatar>
                            <div className={`rounded-2xl px-4 py-2 ${
                              message.sender === "user"
                                ? "bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-br-sm"
                                : "bg-muted rounded-bl-sm"
                            }`}>
                              <p className="text-sm">{message.text}</p>
                              <p className={`text-xs mt-1 ${message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border/50 bg-gradient-to-r from-muted/20 to-transparent">
                    <div className="flex items-end gap-2">
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <div className="flex-1 relative">
                        <Input
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message..."
                          className="pr-10 bg-background/50 border-border/50 rounded-2xl"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full"
                        >
                          <Smile className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className="rounded-full w-10 h-10 p-0 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <p>Select a conversation to start messaging</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
