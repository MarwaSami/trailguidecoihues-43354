import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AudioRecorderProps {
  baseURL: string;
  onSuccess?: (response: any) => void;
  onError?: (error: Error) => void;
}

export const AudioRecorder = ({ baseURL, onSuccess, onError }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
      onError?.(error as Error);
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;

    return new Promise<void>((resolve) => {
      mediaRecorderRef.current!.onstop = async () => {
        try {
          setIsUploading(true);
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });

          const formData = new FormData();
          formData.append('audio_file', audioBlob, 'recording.webm');

          const response = await fetch(`${baseURL}/jobs/record`, {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          const data = await response.json();
          toast.success('Audio uploaded successfully');
          onSuccess?.(data);
        } catch (error) {
          console.error('Error uploading audio:', error);
          toast.error('Failed to upload audio');
          onError?.(error as Error);
        } finally {
          setIsUploading(false);
          mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
        }
        resolve();
      };

      mediaRecorderRef.current!.stop();
      setIsRecording(false);
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {isUploading ? (
        <Button disabled className="w-16 h-16 rounded-full">
          <Loader2 className="h-6 w-6 animate-spin" />
        </Button>
      ) : isRecording ? (
        <Button
          onClick={stopRecording}
          variant="destructive"
          className="w-16 h-16 rounded-full animate-pulse"
        >
          <Square className="h-6 w-6" />
        </Button>
      ) : (
        <Button
          onClick={startRecording}
          className="w-16 h-16 rounded-full"
        >
          <Mic className="h-6 w-6" />
        </Button>
      )}
      <p className="text-sm text-muted-foreground">
        {isUploading ? 'Uploading...' : isRecording ? 'Recording... Click to stop' : 'Click to record'}
      </p>
    </div>
  );
};
