// src/components/Proctoring.tsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import * as handpose from "@tensorflow-models/handpose";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import toast from "react-hot-toast";
import { useInterview } from "@/context/InterviewContext";
import InterviewResultDialog from '@/components/interview/InterviewResultDialog';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Eye, CheckCircle2, Sparkles } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type Models = {
  face: Awaited<ReturnType<typeof blazeface.load>> | null;
  hand: Awaited<ReturnType<typeof handpose.load>> | null;
  object: Awaited<ReturnType<typeof cocoSsd.load>> | null;
};


export default function OldProctoring() {
  const navigate = useNavigate();
  const { currentSession, startInterview, submitAudioAnswer, sendTextMessage, endInterview, stopInterview } = useInterview();
  const backendEndpoint = "https://localhost:7153/api/proctor";

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [camReady, setCamReady] = useState(false);
  const [error, setError] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [models, setModels] = useState<Models>({ face: null, hand: null, object: null });
  const [interviewStopped, setInterviewStopped] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [isEnding, setIsEnding] = useState(false);



  /* ------------------- TensorFlow models ------------------- */
  useEffect(() => {
    (async () => {
      await tf.ready();
      const [f, h, o] = await Promise.all([
        blazeface.load(),
        handpose.load(),
        cocoSsd.load(),
      ]);
      setModels({ face: f, hand: h, object: o });
    })();
  }, []);


  /* ------------------- Camera / Mic start ------------------- */
  const startCam = async () => {
    try {
      setError("");
      setInterviewStopped(false);

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Media devices not supported");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user", frameRate: { ideal: 30 } },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, sampleRate: 44100 },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCamReady(true);
        toast.success("Camera & mic ready");
      }
    } catch (e: any) {
      const msg = e.name === "NotAllowedError"
        ? "Permission denied – allow camera/mic"
        : e.name === "NotFoundError"
        ? "Camera/mic not found"
        : e.message || "Failed to start media";
      setError(msg);
      toast.error(msg);
      setCamReady(false);
    }
  };

  const stopCam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamReady(false);
    setIsRecording(false);
    chunksRef.current = [];
  };

  const toggleMic = async () => {
    if (!streamRef.current || interviewStopped) return;

    if (isRecording) {
      recorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    chunksRef.current = [];
    const audioTracks = streamRef.current.getAudioTracks();
    if (!audioTracks.length) {
      toast.error("No microphone");
      return;
    }

    const mime = ["audio/webm;codecs=opus", "audio/webm"].find(t => MediaRecorder.isTypeSupported(t)) ?? "audio/webm";

    const rec = new MediaRecorder(new MediaStream(audioTracks), { mimeType: mime });
    rec.ondataavailable = e => e.data.size && chunksRef.current.push(e.data);

    rec.onstop = async () => {
      const userBlob = new Blob(chunksRef.current, { type: mime });

      setIsSending(true);
      try {
        await submitAudioAnswer(userBlob);
      } catch (err: any) {
        console.error("Audio submit error:", err);
        toast.error("Failed to process audio: " + err.message);
      } finally {
        setIsSending(false);
      }
    };

    recorderRef.current = rec;
    rec.start(1000);
    setIsRecording(true);
    toast.success("Recording…");
  };

  /* ------------------- Violation handling ------------------- */
  const triggerViolation = (msg: string, color: "red" | "blue") => {
    if (interviewStopped) return;
    const bg = color === "red" ? "bg-red-600" : "bg-blue-600";
    toast.error(
      <div className="flex items-center gap-2">
        <div className={`w-4 h-4 rounded-full ${bg}`}></div>
        <span className="font-semibold">{msg}</span>
      </div>,
      { style: { background: "#333", color: "#fff" }, duration: 6000 }
    );

    // increment and compute remaining tries
    const MAX_VIOLATIONS = 2; // when reached, we will call stop
    const newCount = violationCount + 1;
    setEvents(e => [...e, msg]);
    setInterviewStopped(true);
    setViolationCount(newCount);
    stopCam();

    // notify backend about violation
    fetch(backendEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: [msg], ts: new Date().toISOString(), stopped: newCount >= MAX_VIOLATIONS }),
    }).catch(console.error);

    const remaining = Math.max(0, MAX_VIOLATIONS - newCount);

    if (newCount >= MAX_VIOLATIONS) {
      // No tries left — call stop endpoint and redirect
      (async () => {
        try {
          const conv = localStorage.getItem('conversation_id');
          if (conv) {
            await stopInterview(conv);
          }
        } catch (err: any) {
          console.error('Stop interview failed', err);
          toast.error('Failed to stop interview');
        } finally {
          toast.success('Interview stopped');
          navigate('/my-proposals');
        }
      })();
    } else {
      // Allow user to resume — show a toast with remaining tries and a Resume action
      toast(
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-semibold">Violation detected</div>
            <div className="text-xs">{msg} — {remaining} attempt(s) remaining</div>
          </div>
          <div>
            <button
              onClick={() => {
                setInterviewStopped(false);
                // if there is an active session, just restart camera; otherwise start interview
                if (!currentSession) {
                  const freelancerId = localStorage.getItem('interview_freelancer_id') || "freelancer-1";
                  startInterview(freelancerId, ["React", "TypeScript"]).catch(() => {});
                }
                startCam();
                toast.dismiss();
              }}
              className="px-3 py-1 rounded bg-primary text-white text-sm"
            >
              Resume
            </button>
          </div>
        </div>,
        { duration: 8000 }
      );
    }
  };

  /* ------------------- TF detection loop ------------------- */
  const detect = useCallback(async () => {
    if (!camReady || !canvasRef.current || !videoRef.current || interviewStopped) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (models.face) {
      const faces = await models.face.estimateFaces(video, false);
      faces.forEach((f: any, i: number) => {
        const [x, y] = f.topLeft;
        const [w, h] = [f.bottomRight[0] - x, f.bottomRight[1] - y];
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = "#FF0000";
        ctx.font = "16px Arial";
        ctx.fillText(`Face ${i + 1}`, x, y - 8);
      });
      if (faces.length > 1) { triggerViolation("Multiple faces detected", "red"); return; }
      if (faces.length === 0) { triggerViolation("No face visible", "red"); return; }
    }

    if (models.hand) {
      const hands = await models.hand.estimateHands(video);
      hands.forEach((h: any, i: number) => {
        const box = h.boundingBox;
        ctx.strokeStyle = "#00FF00";
        ctx.lineWidth = 4;
        ctx.strokeRect(box.topLeft[0], box.topLeft[1], box.bottomRight[0] - box.topLeft[0], box.bottomRight[1] - box.topLeft[1]);
        ctx.fillStyle = "#00FF00";
        ctx.fillText(`Hand ${i + 1}`, box.topLeft[0], box.topLeft[1] - 8);
      });
    }

    if (models.object) {
      const objs = await models.object.detect(video);
      for (const o of objs) {
        if (["cell phone", "book", "laptop"].includes(o.class)) {
          const [x, y, w, h] = o.bbox;
          ctx.strokeStyle = "#0000FF";
          ctx.lineWidth = 4;
          ctx.strokeRect(x, y, w, h);
          ctx.fillStyle = "#0000FF";
          ctx.fillText(o.class, x, y - 8);
          triggerViolation(`${o.class} detected`, "blue");
          return;
        }
      }
    }

    requestAnimationFrame(detect);
  }, [camReady, models, interviewStopped, backendEndpoint]);

  useEffect(() => {
    if (camReady && models.face && models.hand && models.object && !interviewStopped) {
      detect();
    }
  }, [camReady, models, detect, interviewStopped]);

  useEffect(() => () => stopCam(), []);

  // Auto-end interview when AI says "Thank you for your time"
  useEffect(() => {
    if (currentSession && currentSession.transcript.length > 0 && !isEnding && !interviewEnded) {
      const lastEntry = currentSession.transcript[currentSession.transcript.length - 1];
      if (lastEntry.role === 'ai' && lastEntry.text.toLowerCase().includes("thank you for your time")) {
        // Auto-trigger end interview
        setIsEnding(true);
        setTimeout(async () => {
          try {
            await endInterview();
            stopCam();
            setInterviewEnded(true);
            toast.success("Interview completed successfully", { duration: 4000 });
          } catch (err) {
            console.error("Failed to end interview:", err);
            toast.error("Failed to end interview");
            setIsEnding(false);
          }
        }, 2000); // Small delay to let user see the message
      }
    }
  }, [currentSession?.transcript, isEnding, interviewEnded]);

  /* ------------------- UI ------------------- */
  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Camera and Violation Log */}
      <div className="lg:col-span-2 space-y-6">
        {/* Camera Card */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Live Camera Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
              <video ref={videoRef} className="w-full aspect-video object-cover" playsInline autoPlay muted />
              <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />

              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full animate-pulse shadow-lg">
                  <span className="w-3 h-3 bg-white rounded-full animate-ping"></span>
                  <span className="font-semibold">RECORDING</span>
                </div>
              )}

              {interviewStopped && !interviewEnded && (
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 bg-opacity-95 flex items-center justify-center text-white text-center p-6">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold">Interview Terminated</h2>
                    <p className="text-lg">Violation: {events[events.length - 1]}</p>
                    {violationCount < 2 && (
                      <Button onClick={startCam} variant="secondary" size="lg">
                        Retry (1 left)
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {interviewEnded && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent flex items-center justify-center text-white text-center p-8">
                  <div className="space-y-6 max-w-md">
                    <div className="flex justify-center">
                      <div className="relative">
                        <CheckCircle2 className="h-24 w-24 text-white animate-scale-in" />
                        <Sparkles className="h-8 w-8 text-white/80 absolute -top-2 -right-2 animate-pulse" />
                      </div>
                    </div>
                    <h2 className="text-4xl font-bold animate-fade-in">Interview Complete!</h2>
                    <p className="text-lg text-white/90 animate-fade-in">
                      Thank you for participating. Your responses have been recorded successfully.
                    </p>
                    <div className="pt-4 animate-fade-in">
                      <Button 
                        onClick={() => setShowResults(true)} 
                        variant="secondary" 
                        size="lg"
                        className="min-w-[200px] font-semibold"
                      >
                        View Results
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {error && !interviewStopped && (
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 bg-opacity-90 flex items-center justify-center text-white text-center p-4">
                  <div className="space-y-4">
                    <p className="text-2xl font-bold">Error</p>
                    <p>{error}</p>
                    <Button onClick={startCam} variant="secondary" className="mt-4">
                      Retry
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <Button
                onClick={async () => {
                  if (camReady && !interviewStopped && !isEnding) {
                    // End the interview
                    setIsEnding(true);
                    await endInterview();
                    stopCam();
                    setInterviewEnded(true);
                    // setTimeout(() => {
                    //   navigate('/my-proposals');
                    // }, 1500);
                  } else if (!camReady) {
                    startCam();
                    if (!currentSession) {
                      const freelancerId = localStorage.getItem('interview_freelancer_id') || "freelancer-1";
                      await startInterview(freelancerId, ["React", "TypeScript"]);
                    }
                  }
                }}
                disabled={(interviewStopped && violationCount >= 2) || isEnding}
                variant={camReady ? "destructive" : "default"}
                size="lg"
                className="min-w-[150px] font-semibold"
              >
                {interviewStopped && violationCount >= 2 
                  ? "No Retries Left" 
                  : camReady 
                    ? "End Interview" 
                    : "Start Interview"}
              </Button>

              <Button
                onClick={toggleMic}
                disabled={!camReady || interviewStopped || isSending || interviewEnded}
                variant={isRecording ? "destructive" : "default"}
                size="lg"
                className="gap-2 min-w-[120px] font-semibold relative"
              >
                {isSending ? (
                  <>
                    <Sparkles className="h-5 w-5 animate-pulse" />
                    <span className="animate-pulse">Processing</span>
                  </>
                ) : (
                  <>
                    {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    {isRecording ? "Stop" : "Speak"}
                  </>
                )}
              </Button>

              <Button
                onClick={() => setShowResults(true)}
                disabled={!currentSession || currentSession.status !== 'completed'}
                variant="outline"
                size="lg"
                className="min-w-[150px] font-semibold"
              >
                View Results
              </Button>
            </div>

            {/* Processing State Overlay */}
            {isSending && (
              <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <LoadingSpinner size="sm" message="Processing your response..." />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Violation Log */}
        <Card className="border-destructive/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-destructive/5 to-destructive/10">
            <CardTitle className="text-destructive flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              Violation Log
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="max-h-32 overflow-y-auto space-y-2">
              {events.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No violations detected</p>
              ) : (
                <ul className="space-y-2">
                  {events.map((e, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-destructive mt-0.5">•</span>
                      <span className="text-destructive font-medium flex-1">{e}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Transcript */}
      <div className="lg:col-span-1">
        <Card className="h-full shadow-lg border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">💬</span>
              Interview Transcript
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2">

              {!currentSession || currentSession.transcript.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-sm">Interview transcript will appear here...</p>
                  <p className="text-xs text-muted-foreground mt-2">Click "Speak" to start conversing</p>
                </div>
              ) : (
                <>
                  {currentSession?.transcript.map((entry, index) => (
                    <div
                      key={`session-${index}`}
                      className={`p-4 rounded-xl shadow-sm transition-all hover:shadow-md ${
                        entry.role === 'user'
                          ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-foreground ml-4'
                          : 'bg-gradient-to-r from-muted to-muted/50 text-foreground mr-4'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">
                          {entry.role === 'user' ? '👤' : '🤖'}
                        </span>
                        <p className="text-xs font-bold uppercase tracking-wide">
                          {entry.role === 'user' ? 'You' : 'AI Interviewer'}
                        </p>
                      </div>
                      <p className="text-sm leading-relaxed">{entry.text}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    {/* Result dialog */}
    <InterviewResultDialog open={showResults} onOpenChange={(o) => setShowResults(o)} />
    </>
  );
}