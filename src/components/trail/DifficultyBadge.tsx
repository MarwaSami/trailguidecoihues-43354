
import React from 'react';
import { Badge } from '../ui/badge';
import { Difficulty } from '../../types/trail';
import { useLanguage } from '../../context/LanguageContext';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: 'sm' | 'md' | 'lg';
}

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, size = 'sm' }) => {
  const { t } = useLanguage();

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-500',
      moderate: 'bg-yellow-500',
      hard: 'bg-orange-500',
      expert: 'bg-red-500',
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-500';
  };

  const getTranslatedDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return t('difficultyEasy');
      case 'moderate':
        return t('difficultyModerate');
      case 'hard':
        return t('difficultyHard');
      case 'expert':
        return t('difficultyExpert');
      default:
        return difficulty;
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-3 py-1',
  };

  return (
    <Badge 
      className={`${getDifficultyColor(difficulty)} text-white ${sizeClasses[size]}`}
    >
      {getTranslatedDifficulty(difficulty)}
    </Badge>
  );
};

export default DifficultyBadge;
