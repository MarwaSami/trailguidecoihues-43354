// src/components/Proctoring.tsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import * as handpose from "@tensorflow-models/handpose";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import toast from "react-hot-toast";

type Models = {
  face: Awaited<ReturnType<typeof blazeface.load>> | null;
  hand: Awaited<ReturnType<typeof handpose.load>> | null;
  object: Awaited<ReturnType<typeof cocoSsd.load>> | null;
};

type ChatMessage = {
  id: string;
  sender: "user" | "ai";
  audioUrl: string;
};

export default function Proctoring() {
  const backendEndpoint = "https://localhost:7153/api/proctor";
  const chatEndpoint = "https://localhost:7153/api/chat";

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
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);

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
        throw new Error("Media devices not supported in this browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user", frameRate: { ideal: 30 } },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, sampleRate: 44100 },
      });

      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];
      if (!videoTrack) throw new Error("No video track");
      if (!audioTrack) throw new Error("No audio track");

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCamReady(true);
        toast.success("Camera & mic ready");
      }
    } catch (e: any) {
      console.error(e);
      const msg = e.name === "NotAllowedError"
        ? "Permission denied – allow camera/mic"
        : e.name === "NotFoundError"
        ? "Camera/mic not found"
        : e.name === "NotReadableError"
        ? "Device already in use"
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

  // ---- start recording -------------------------------------------------
  chunksRef.current = [];
  const audioTracks = streamRef.current.getAudioTracks();
  if (!audioTracks.length) {
    toast.error("No microphone");
    return;
  }

  // Choose best supported MIME (webm with opus is ideal)
  const mime = ["audio/webm;codecs=opus", "audio/webm"].find(t => MediaRecorder.isTypeSupported(t)) ?? "audio/webm";

  const rec = new MediaRecorder(new MediaStream(audioTracks), { mimeType: mime });
  rec.ondataavailable = e => e.data.size && chunksRef.current.push(e.data);

  rec.onstop = async () => {
    // 1. USER AUDIO (recorded locally) – always works
    const userBlob = new Blob(chunksRef.current, { type: mime });
    const userUrl = URL.createObjectURL(userBlob);
    setChat(c => [...c, { id: Date.now().toString(), sender: "user", audioUrl: userUrl }]);

    // 2. SEND TO BACKEND
    setIsSending(true);
    try {
      const res = await fetch(chatEndpoint, {
        method: "POST",
        headers: { "Content-Type": mime },
        body: userBlob,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }

      // 3. AI AUDIO (echo from server) – FORCE correct MIME
      const aiBlob = await res.blob();
      const fixedAiBlob = new Blob([aiBlob], { type: "audio/webm" }); // <-- critical
      const aiUrl = URL.createObjectURL(fixedAiBlob);

      setChat(c => [...c, { id: (Date.now() + 1).toString(), sender: "ai", audioUrl: aiUrl }]);
    } catch (err: any) {
      console.error(err);
      toast.error("Echo failed: " + err.message);
    } finally {
      setIsSending(false);
    }
  };

  recorderRef.current = rec;
  rec.start(1000); // collect every second
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

    setEvents(e => [...e, msg]);
    setInterviewStopped(true);
    setViolationCount(c => c + 1);
    stopCam();

    fetch(backendEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: [msg], ts: new Date().toISOString(), stopped: true }),
    }).catch(console.error);
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

    // face
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

    // hand (no violation)
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

    // object
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

  /* ------------------- UI ------------------- */
  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Proctoring Live</h1>

      <div className="relative bg-black rounded-lg overflow-hidden mb-6">
        <video ref={videoRef} className="w-full" playsInline autoPlay muted />
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />

        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full animate-pulse">
            <span className="w-3 h-3 bg-white rounded-full animate-ping"></span>
            REC
          </div>
        )}

        {interviewStopped && (
          <div className="absolute inset-0 bg-red-600 bg-opacity-95 flex items-center justify-center text-white text-center p-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Interview Terminated</h2>
              <p className="text-lg mb-4">Violation: {events[events.length - 1]}</p>
              {violationCount < 2 && (
                <button onClick={startCam} className="px-6 py-2 bg-white text-red-600 rounded-full font-bold">
                  Retry (1 left)
                </button>
              )}
            </div>
          </div>
        )}

        {error && !interviewStopped && (
          <div className="absolute inset-0 bg-red-600 bg-opacity-90 flex items-center justify-center text-white text-center p-4">
            <div>
              <p className="text-2xl font-bold">Error</p>
              <p>{error}</p>
              <button onClick={startCam} className="mt-4 px-6 py-2 bg-white text-red-600 rounded-full font-bold">
                Retry
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-6 mb-6">
        <button
          onClick={camReady && !interviewStopped ? stopCam : startCam}
          disabled={interviewStopped && violationCount >= 2}
          className={`px-8 py-3 rounded-full font-bold transition ${
            interviewStopped && violationCount >= 2
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : camReady
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {interviewStopped && violationCount >= 2 ? "No Retries Left" : camReady ? "Stop Camera" : "Start Interview"}
        </button>

        <button
          onClick={toggleMic}
          disabled={!camReady || interviewStopped || isSending}
          className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 transition ${
            !camReady || interviewStopped || isSending
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : isRecording
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {isSending ? "Sending..." : isRecording ? "Stop Mic" : "Speak"}
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6 max-h-64 overflow-y-auto">
        <h3 className="font-bold mb-3 text-blue-700">Audio Chat</h3>
        {chat.length === 0 ? (
          <p className="text-gray-500 text-sm">Say something to start...</p>
        ) : (
          <div className="space-y-3">
            {chat.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs p-3 rounded-lg ${msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                  <audio
                    controls
                    src={msg.audioUrl}
                    className="w-full h-8"
                    preload="auto"
                    onError={e => console.error("Play error:", e)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow max-h-48 overflow-y-auto">
        <h3 className="font-bold mb-2 text-red-600">Violation Log</h3>
        {events.length === 0 ? (
          <p className="text-gray-500">No violations</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {events.map((e, i) => (
              <li key={i} className="text-red-600 font-medium">• {e}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}