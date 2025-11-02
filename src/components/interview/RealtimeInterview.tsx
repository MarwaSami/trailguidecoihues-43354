import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { AudioRecorder, encodeAudioForAPI, playAudioData, clearAudioQueue } from '@/utils/RealtimeInterview';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff } from 'lucide-react';

export function RealtimeInterview() {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [transcript, setTranscript] = useState<Array<{ role: 'user' | 'assistant', text: string }>>([]);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      videoStreamRef.current = stream;
      setIsCameraOn(true);
      toast({
        title: "Camera enabled",
        description: "Your camera is now active",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Camera error",
        description: "Could not access camera",
      });
    }
  };

  const stopCamera = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
      videoStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  const connect = async () => {
    try {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      
      const projectRef = 'uwipbqbqhdlylvubzdto';
      const wsUrl = `wss://${projectRef}.supabase.co/functions/v1/realtime-interview`;
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('Connected to interview service');
        setIsConnected(true);
        startRecording();
        toast({
          title: "Interview started",
          description: "You can now speak with the AI interviewer",
        });
      };

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('Received:', data.type);

        if (data.type === 'response.audio.delta') {
          setIsAISpeaking(true);
          const binaryString = atob(data.delta);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          if (audioContextRef.current) {
            await playAudioData(audioContextRef.current, bytes);
          }
        } else if (data.type === 'response.audio.done') {
          setIsAISpeaking(false);
        } else if (data.type === 'conversation.item.input_audio_transcription.completed') {
          setTranscript(prev => [...prev, { role: 'user', text: data.transcript }]);
        } else if (data.type === 'response.audio_transcript.delta') {
          setTranscript(prev => {
            const newTranscript = [...prev];
            const lastItem = newTranscript[newTranscript.length - 1];
            if (lastItem && lastItem.role === 'assistant') {
              lastItem.text += data.delta;
            } else {
              newTranscript.push({ role: 'assistant', text: data.delta });
            }
            return newTranscript;
          });
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          variant: "destructive",
          title: "Connection error",
          description: "Failed to connect to interview service",
        });
      };

      wsRef.current.onclose = () => {
        console.log('Disconnected');
        setIsConnected(false);
        setIsRecording(false);
        stopRecording();
      };

    } catch (error) {
      console.error('Connection error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start interview",
      });
    }
  };

  const startRecording = async () => {
    try {
      recorderRef.current = new AudioRecorder((audioData) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const encoded = encodeAudioForAPI(audioData);
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encoded
          }));
        }
      });
      await recorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      toast({
        variant: "destructive",
        title: "Microphone error",
        description: "Could not access microphone",
      });
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setIsRecording(false);
  };

  const disconnect = () => {
    stopRecording();
    stopCamera();
    clearAudioQueue();
    wsRef.current?.close();
    audioContextRef.current?.close();
    audioContextRef.current = null;
    setIsConnected(false);
    setTranscript([]);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-background/40 backdrop-blur-xl border border-border/50">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Video Preview */}
          <div className="flex-1">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              {isCameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <VideoOff className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
              {isAISpeaking && (
                <Badge className="absolute top-4 right-4 bg-primary/90">
                  AI Speaking...
                </Badge>
              )}
              {isRecording && (
                <Badge className="absolute top-4 left-4 bg-destructive/90 animate-pulse">
                  Recording
                </Badge>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4 md:w-64">
            <h3 className="font-bold text-lg">Interview Controls</h3>
            
            {!isConnected ? (
              <Button onClick={connect} variant="hero" className="gap-2">
                <Phone className="w-4 h-4" />
                Start Interview
              </Button>
            ) : (
              <Button onClick={disconnect} variant="destructive" className="gap-2">
                <PhoneOff className="w-4 h-4" />
                End Interview
              </Button>
            )}

            <Button
              onClick={isCameraOn ? stopCamera : startCamera}
              variant={isCameraOn ? "secondary" : "outline"}
              className="gap-2"
            >
              {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
            </Button>

            {isConnected && (
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "secondary" : "outline"}
                className="gap-2"
              >
                {isRecording ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                {isRecording ? "Mute" : "Unmute"}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Transcript */}
      {transcript.length > 0 && (
        <Card className="p-6 bg-background/40 backdrop-blur-xl border border-border/50">
          <h3 className="font-bold text-lg mb-4">Conversation Transcript</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transcript.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg ${
                  item.role === 'user'
                    ? 'bg-primary/10 ml-8'
                    : 'bg-secondary/10 mr-8'
                }`}
              >
                <p className="text-xs font-semibold mb-1 text-muted-foreground">
                  {item.role === 'user' ? 'You' : 'AI Interviewer'}
                </p>
                <p className="text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
