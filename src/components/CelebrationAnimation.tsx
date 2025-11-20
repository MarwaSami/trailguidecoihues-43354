import { useEffect, useState } from "react";
import { Sparkles, Heart, Star } from "lucide-react";

interface CelebrationAnimationProps {
  show: boolean;
  onComplete?: () => void;
}

export const CelebrationAnimation = ({ show, onComplete }: CelebrationAnimationProps) => {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 20 }, (_, i) => i);
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((i) => {
        const icons = [Sparkles, Heart, Star];
        const Icon = icons[Math.floor(Math.random() * icons.length)];
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        
        return (
          <div
            key={i}
            className="absolute animate-celebration-particle"
            style={{
              left: `${startX}%`,
              top: `${startY}%`,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          >
            <Icon 
              className="text-primary opacity-80"
              style={{
                width: `${16 + Math.random() * 16}px`,
                height: `${16 + Math.random() * 16}px`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
