import { useEffect, useState } from "react";

interface CelebrationAnimationProps {
  show: boolean;
  onComplete?: () => void;
}

// Confetti piece component
const ConfettiPiece = ({ color, shape, size }: { color: string; shape: 'ribbon' | 'circle' | 'square' | 'star' | 'streamer'; size: number }) => {
  if (shape === 'ribbon') {
    return (
      <svg width={size * 2} height={size * 4} viewBox="0 0 20 40" fill="none">
        <path
          d="M2 0C2 0 8 10 2 20C-4 30 12 40 12 40"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }
  
  if (shape === 'streamer') {
    return (
      <svg width={size * 3} height={size * 5} viewBox="0 0 30 50" fill="none">
        <path
          d="M15 0C15 0 5 15 15 25C25 35 10 50 10 50"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }
  
  if (shape === 'star') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 2L14.09 8.26L21 9.27L16.5 14.14L17.18 21.02L12 17.77L6.82 21.02L7.5 14.14L3 9.27L9.91 8.26L12 2Z" />
      </svg>
    );
  }
  
  if (shape === 'circle') {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
    );
  }
  
  // Square
  return (
    <div
      style={{
        width: size,
        height: size * 0.6,
        backgroundColor: color,
        borderRadius: 2,
      }}
    />
  );
};

// Festive confetti colors
const confettiColors = [
  "#FF6B6B", // Red
  "#FFD93D", // Yellow
  "#6BCB77", // Green
  "#4D96FF", // Blue
  "#FF8B94", // Pink
  "#AA96DA", // Purple
  "#F38181", // Coral
  "#95E1D3", // Mint
  "#FFB6C1", // Light Pink
  "#87CEEB", // Sky Blue
  "#FFEAA7", // Light Yellow
  "#DDA0DD", // Plum
  "#98D8C8", // Sea Green
  "#F7DC6F", // Gold
  "#BB8FCE", // Lavender
];

const shapes: Array<'ribbon' | 'circle' | 'square' | 'star' | 'streamer'> = ['ribbon', 'circle', 'square', 'star', 'streamer'];

export const CelebrationAnimation = ({ show, onComplete }: CelebrationAnimationProps) => {
  const [confetti, setConfetti] = useState<number[]>([]);

  useEffect(() => {
    if (show) {
      // Create 40 confetti pieces for a festive effect
      const newConfetti = Array.from({ length: 40 }, (_, i) => i);
      setConfetti(newConfetti);

      const timer = setTimeout(() => {
        setConfetti([]);
        onComplete?.();
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show || confetti.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confetti.map((i) => {
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const startX = Math.random() * 100;
        const size = 8 + Math.random() * 12;
        const delay = Math.random() * 1.5;
        const duration = 3 + Math.random() * 2;
        const rotateStart = Math.random() * 360;
        
        return (
          <div
            key={i}
            className="absolute animate-confetti-fall"
            style={{
              left: `${startX}%`,
              top: -20,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              transform: `rotate(${rotateStart}deg)`,
            }}
          >
            <ConfettiPiece color={color} shape={shape} size={size} />
          </div>
        );
      })}
    </div>
  );
};
