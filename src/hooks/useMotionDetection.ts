import { useEffect, useRef, useState } from 'react';

interface UseMotionDetectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
  threshold?: number;
  interval?: number;
}

export const useMotionDetection = ({
  videoRef,
  isActive,
  threshold = 15,
  interval = 500
}: UseMotionDetectionProps) => {
  const [motionDetected, setMotionDetected] = useState(false);
  const [motionLevel, setMotionLevel] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previousFrameRef = useRef<ImageData | null>(null);
  const animationFrameRef = useRef<number>();
  const lastCheckRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive || !videoRef.current) {
      setMotionDetected(false);
      setMotionLevel(0);
      return;
    }

    const video = videoRef.current;
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const detectMotion = () => {
      const now = Date.now();
      
      if (now - lastCheckRef.current < interval) {
        animationFrameRef.current = requestAnimationFrame(detectMotion);
        return;
      }
      
      lastCheckRef.current = now;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        if (previousFrameRef.current) {
          const diff = calculateFrameDifference(previousFrameRef.current, currentFrame);
          const motionPercent = (diff / (canvas.width * canvas.height)) * 100;
          
          setMotionLevel(Math.min(100, motionPercent));
          setMotionDetected(motionPercent > threshold);
        }
        
        previousFrameRef.current = currentFrame;
      }
      
      animationFrameRef.current = requestAnimationFrame(detectMotion);
    };

    detectMotion();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      previousFrameRef.current = null;
    };
  }, [isActive, videoRef, threshold, interval]);

  return { motionDetected, motionLevel };
};

const calculateFrameDifference = (frame1: ImageData, frame2: ImageData): number => {
  let diffCount = 0;
  const data1 = frame1.data;
  const data2 = frame2.data;
  const pixelThreshold = 30;

  for (let i = 0; i < data1.length; i += 4) {
    const rDiff = Math.abs(data1[i] - data2[i]);
    const gDiff = Math.abs(data1[i + 1] - data2[i + 1]);
    const bDiff = Math.abs(data1[i + 2] - data2[i + 2]);
    
    const avgDiff = (rDiff + gDiff + bDiff) / 3;
    
    if (avgDiff > pixelThreshold) {
      diffCount++;
    }
  }
  
  return diffCount;
};
