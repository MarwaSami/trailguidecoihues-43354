import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import * as handpose from '@tensorflow-models/handpose';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, AlertCircle } from 'lucide-react';
import ChatInterface from './proctoring/ChatInterface';
import ViolationLogger from './proctoring/ViolationLogger';

interface ProctoringProps {
  backendEndpoint?: string;
}

interface Violation {
  id: string;
  message: string;
  timestamp: Date;
}

const TestComponent: React.FC<ProctoringProps> = ({ backendEndpoint }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const [events, setEvents] = useState<string[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceModel, setFaceModel] = useState<any>(null);
  const [handModel, setHandModel] = useState<any>(null);
  const [objectModel, setObjectModel] = useState<any>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      await tf.ready();
      const faceDetector = await blazeface.load();
      const handDetector = await handpose.load();
      const objectDetector = await cocoSsd.load();
      setFaceModel(faceDetector);
      setHandModel(handDetector);
      setObjectModel(objectDetector);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission denied. Please allow camera access.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found. Please connect a camera.');
      } else if (err.name === 'NotReadableError') {
        setCameraError('Camera is already in use by another application.');
      } else {
        setCameraError('Failed to access camera. Please check your device settings.');
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
      setCameraError(null);
    }
  };

  const startAudioRecording = async () => {
    try {
      setAudioError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        
        // Create audio element for playback
        const audioUrl = URL.createObjectURL(blob);
        if (audioElementRef.current) {
          audioElementRef.current.src = audioUrl;
        } else {
          const audio = new Audio(audioUrl);
          audio.controls = true;
          audioElementRef.current = audio;
        }
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setAudioError('Microphone permission denied. Please allow microphone access.');
      } else if (err.name === 'NotFoundError') {
        setAudioError('No microphone found. Please connect a microphone.');
      } else {
        setAudioError('Failed to access microphone. Please check your device settings.');
      }
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadAudioFile = () => {
    if (!audioBlob) return;
    
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-audio-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const detect = async () => {
      if (
        videoRef.current &&
        canvasRef.current &&
        faceModel &&
        handModel &&
        objectModel &&
        videoRef.current.readyState === 4
      ) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const faces = (await faceModel.estimateFaces(video, false)) as any[];
        const hands = (await handModel.estimateHands(video)) as any[];
        const objects = (await objectModel.detect(video)) as any[];

        let newEvents: string[] = [];

        // === Face detection ===
        faces.forEach((face, index) => {
          const start = face.topLeft;
          const end = face.bottomRight;
          console.log("Face detected:");
          const size = [end[0] - start[0], end[1] - start[1]];
          ctx.beginPath();
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'red';
          ctx.rect(start[0], start[1], size[0], size[1]);
          ctx.stroke();
          ctx.fillStyle = 'red';
          ctx.font = '12px Arial';
          ctx.fillText(`Face ${index + 1}`, start[0], start[1] - 5);
        });

        if (faces.length > 1) {
          newEvents.push('Extra face detected');
        } else if (faces.length === 0) {
          newEvents.push('No face detected');
        }
        // === Hand detection ===
        hands.forEach((hand, index) => {
          const keypoints = hand.landmarks;
          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
          keypoints.forEach(([x, y]) => {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          });
          ctx.strokeStyle = 'green';
          ctx.rect(minX, minY, maxX - minX, maxY - minY);
          ctx.stroke();
          ctx.fillText(`Hand ${index + 1}`, minX, minY - 5);
        });

        if (hands.length < 2) {
          newEvents.push('Hands not fully visible');
        }
        
        // === Object detection ===
        objects.forEach((obj) => {
          if (['cell phone', 'book'].includes(obj.class)) {
            newEvents.push(`${obj.class} detected (potential cheating)`);
            ctx.strokeStyle = 'blue';
            const [x, y, width, height] = obj.bbox;
            ctx.rect(x, y, width, height);
            ctx.stroke();
            ctx.fillText(obj.class, x, y - 5);
          }
        });

        if (newEvents.length > 0) {
          setEvents((prev) => [...prev, ...newEvents]);
          
          // Log violations with detailed information
          const newViolations: Violation[] = newEvents.map((event) => ({
            id: `${Date.now()}-${Math.random()}`,
            message: event,
            timestamp: new Date()
          }));
          setViolations((prev) => [...prev, ...newViolations]);
          
          // Log to console for debugging
          console.log('⚠️ Proctoring Violations Detected:', {
            violations: newViolations,
            timestamp: new Date().toISOString(),
            totalViolations: violations.length + newViolations.length
          });
          
          if (backendEndpoint) {
            fetch(backendEndpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                events: newEvents, 
                violations: newViolations,
                timestamp: new Date().toISOString() 
              }),
            }).catch((err) => console.error('Error sending to backend:', err));
          }
        }

        requestAnimationFrame(detect);
      }
    };

    if (modelsLoaded && isCameraActive) detect();
  }, [modelsLoaded, faceModel, handModel, objectModel, backendEndpoint, isCameraActive]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Live Interview Session
          </h1>
          <p className="text-muted-foreground">AI-powered proctoring and monitoring</p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Camera Preview */}
          <Card className="xl:col-span-5 p-0 bg-card border-2 border-primary/10 overflow-hidden shadow-lg">
            <div className="relative aspect-video bg-gradient-to-br from-muted/50 to-muted rounded-lg overflow-hidden">
              {isCameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  />
                  {isRecording && (
                    <div className="absolute top-4 left-4 bg-destructive/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg animate-pulse">
                      <div className="flex items-center gap-2 text-white">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                        <span className="text-sm font-semibold">Recording</span>
                      </div>
                    </div>
                  )}
                  {modelsLoaded && (
                    <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs text-white font-medium">AI Monitoring Active</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center flex-col gap-6 p-8">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <VideoOff className="w-12 h-12 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Camera Preview</h3>
                    <p className="text-muted-foreground text-sm">Start the interview to activate camera</p>
                  </div>
                  {cameraError && (
                    <div className="max-w-md text-center">
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                        <AlertCircle className="w-6 h-6 text-destructive mx-auto mb-2" />
                        <p className="text-sm text-destructive font-medium">{cameraError}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Chat Interface */}
          <div className="xl:col-span-4 h-[600px]">
            <ChatInterface />
          </div>

          {/* Controls and Violations Panel */}
          <div className="xl:col-span-3 space-y-4">
            <Card className="p-6 bg-card border-2 border-primary/10 shadow-lg">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Video className="w-4 h-4 text-primary" />
                </div>
                Controls
              </h2>
              
              <div className="space-y-3">
                {!isCameraActive ? (
                  <Button
                    onClick={startCamera}
                    className="w-full gap-2 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                    variant="default"
                    disabled={!modelsLoaded}
                  >
                    <Video className="w-5 h-5" />
                    Start Interview
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={stopCamera}
                      className="w-full gap-2 h-12 border-2 hover:bg-destructive hover:text-white hover:border-destructive transition-all"
                      variant="outline"
                    >
                      <VideoOff className="w-5 h-5" />
                      Stop Camera
                    </Button>
                    
                    {!isRecording ? (
                      <Button
                        onClick={startAudioRecording}
                        className="w-full gap-2 h-12 font-semibold shadow-lg hover:shadow-xl transition-all"
                        variant="default"
                      >
                        <Mic className="w-5 h-5" />
                        Start Recording
                      </Button>
                    ) : (
                      <Button
                        onClick={stopAudioRecording}
                        className="w-full gap-2 h-12 font-semibold shadow-lg hover:shadow-xl transition-all"
                        variant="destructive"
                      >
                        <MicOff className="w-5 h-5" />
                        End Recording
                      </Button>
                    )}
                  </>
                )}
              </div>

              {!modelsLoaded && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-primary">Loading AI models...</span>
                  </div>
                </div>
              )}
              
              {audioError && (
                <div className="mt-4 p-4 bg-destructive/10 border-2 border-destructive/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive font-medium">{audioError}</p>
                  </div>
                </div>
              )}
              
              {audioBlob && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg border-2 border-primary/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <p className="text-sm font-semibold text-primary">
                      Audio Recording Ready
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Size: {(audioBlob.size / 1024).toFixed(2)} KB
                  </p>
                  <Button 
                    onClick={downloadAudioFile}
                    size="sm"
                    className="w-full font-medium"
                    variant="outline"
                  >
                    Download Audio File
                  </Button>
                </div>
              )}
            </Card>

            {/* Violations Log */}
            <ViolationLogger violations={violations} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;
