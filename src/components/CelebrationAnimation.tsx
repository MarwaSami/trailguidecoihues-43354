import { useEffect, useState } from "react";

interface CelebrationAnimationProps {
  show: boolean;
  onComplete?: () => void;
}

// Balloon SVG component
const Balloon = ({ color, size }: { color: string; size: number }) => (
  <svg
    width={size}
    height={size * 1.3}
    viewBox="0 0 40 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Balloon body */}
    <ellipse cx="20" cy="18" rx="18" ry="18" fill={color} />
    {/* Shine effect */}
    <ellipse cx="12" cy="12" rx="4" ry="6" fill="white" fillOpacity="0.3" />
    {/* Balloon knot */}
    <path d="M18 36L20 38L22 36L20 34L18 36Z" fill={color} />
    {/* String */}
    <path
      d="M20 38C20 42 18 46 20 50"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      style={{ filter: "brightness(0.7)" }}
    />
  </svg>
);

// Colorful balloon colors like a birthday party
const balloonColors = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#FFE66D", // Yellow
  "#95E1D3", // Mint
  "#F38181", // Coral
  "#AA96DA", // Purple
  "#FCBAD3", // Pink
  "#A8E6CF", // Light Green
  "#FF8B94", // Salmon
  "#88D8B0", // Sea Green
  "#FFEAA7", // Light Yellow
  "#DDA0DD", // Plum
  "#87CEEB", // Sky Blue
  "#F0E68C", // Khaki
  "#FFB6C1", // Light Pink
];

export const CelebrationAnimation = ({ show, onComplete }: CelebrationAnimationProps) => {
  const [balloons, setBalloons] = useState<number[]>([]);

  useEffect(() => {
    if (show) {
      // Create 25 balloons for a festive effect
      const newBalloons = Array.from({ length: 25 }, (_, i) => i);
      setBalloons(newBalloons);

      const timer = setTimeout(() => {
        setBalloons([]);
        onComplete?.();
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show || balloons.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {balloons.map((i) => {
        const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        const startX = Math.random() * 100;
        const size = 30 + Math.random() * 25;
        const delay = Math.random() * 1.5;
        const duration = 3.5 + Math.random() * 1.5;
        
        return (
          <div
            key={i}
            className="absolute animate-balloon-fall"
            style={{
              left: `${startX}%`,
              top: 0,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          >
            <Balloon color={color} size={size} />
          </div>
        );
      })}
    </div>
  );
};
