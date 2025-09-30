
import React from 'react';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../context/LanguageContext';

interface TrailHighlightsProps {
  highlights: string[];
  size?: 'sm' | 'md' | 'lg';
}

const TrailHighlights: React.FC<TrailHighlightsProps> = ({ 
  highlights,
  size = 'sm'
}) => {
  const { t } = useLanguage();

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex flex-wrap gap-2">
      {highlights.map((highlight, index) => (
        <Badge 
          key={index} 
          variant="secondary" 
          className={sizeClasses[size]}
        >
          {t(highlight)}
        </Badge>
      ))}
    </div>
  );
};

export default TrailHighlights;
