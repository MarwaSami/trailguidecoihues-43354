import { useRef, useState, useCallback } from 'react';

interface AudioChunk {
  data: Float32Array;
  timestamp: number;
}

export const useAudioCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const audioChunksRef = useRef<AudioChunk[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const startCapture = useCallback(async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      sourceRef.current = audioContextRef.current.createMediaStreamSource(streamRef.current);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      processorRef.current.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        audioChunksRef.current.push({
          data: new Float32Array(inputData),
          timestamp: Date.now()
        });
      };

      sourceRef.current.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);
      
      setIsCapturing(true);
      console.log('Audio capture started');
    } catch (error) {
      console.error('Error starting audio capture:', error);
      throw error;
    }
  }, []);

  const stopCapture = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setIsCapturing(false);
    console.log('Audio capture stopped');
  }, []);

  const getAudioChunks = useCallback(() => {
    return [...audioChunksRef.current];
  }, []);

  const clearAudioChunks = useCallback(() => {
    audioChunksRef.current = [];
  }, []);

  const exportAudioAsBase64 = useCallback(() => {
    const chunks = audioChunksRef.current;
    if (chunks.length === 0) return null;

    // Combine all chunks into a single Float32Array
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.data.length, 0);
    const combinedAudio = new Float32Array(totalLength);
    let offset = 0;
    
    for (const chunk of chunks) {
      combinedAudio.set(chunk.data, offset);
      offset += chunk.data.length;
    }

    // Convert to PCM16
    const int16Array = new Int16Array(combinedAudio.length);
    for (let i = 0; i < combinedAudio.length; i++) {
      const s = Math.max(-1, Math.min(1, combinedAudio[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    // Convert to base64
    const uint8Array = new Uint8Array(int16Array.buffer);
    let binary = '';
    const chunkSize = 0x8000;
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    return btoa(binary);
  }, []);

  return {
    isCapturing,
    startCapture,
    stopCapture,
    getAudioChunks,
    clearAudioChunks,
    exportAudioAsBase64
  };
};
