
import React from 'react';
import { TrailType, Difficulty, TravelTimeCategory } from '../types/trail';
import { useLanguage } from '../context/LanguageContext';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';

interface FiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedType: TrailType | 'all';
  setSelectedType: (type: TrailType | 'all') => void;
  selectedDifficulty: Difficulty | 'all';
  setSelectedDifficulty: (difficulty: Difficulty | 'all') => void;
  selectedTravelTime: TravelTimeCategory | 'all';
  setSelectedTravelTime: (time: TravelTimeCategory | 'all') => void;
}

const FiltersDialog: React.FC<FiltersDialogProps> = ({
  open,
  onOpenChange,
  selectedType,
  setSelectedType,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedTravelTime,
  setSelectedTravelTime,
}) => {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('filters')}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div>
            <p className="text-base font-medium text-gray-500 mb-2">{t('filterByType')}</p>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={selectedType === 'all' ? 'default' : 'outline'}
                className="cursor-pointer text-base"
                onClick={() => setSelectedType('all')}
              >
                {t('filterAll')}
              </Badge>
              <Badge 
                variant={selectedType === 'day-hike' ? 'default' : 'outline'}
                className="cursor-pointer text-base"
                onClick={() => setSelectedType('day-hike')}
              >
                {t('filterDayHike')}
              </Badge>
              <Badge 
                variant={selectedType === 'multi-day' ? 'default' : 'outline'}
                className="cursor-pointer text-base"
                onClick={() => setSelectedType('multi-day')}
              >
                {t('filterMultiDay')}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-base font-medium text-gray-500 mb-2">{t('filterByDifficulty')}</p>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
                className="cursor-pointer text-base"
                onClick={() => setSelectedDifficulty('all')}
              >
                {t('filterAll')}
              </Badge>
              <Badge 
                variant={selectedDifficulty === 'easy' ? 'default' : 'outline'}
                className="cursor-pointer text-base"
                onClick={() => setSelectedDifficulty('easy')}
              >
                {t('difficultyEasy')}
              </Badge>
              <Badge 
                variant={selectedDifficulty === 'moderate' ? 'default' : 'outline'}
                className="cursor-pointer text-base"
                onClick={() => setSelectedDifficulty('moderate')}
              >
                {t('difficultyModerate')}
              </Badge>
              <Badge 
                variant={selectedDifficulty === 'hard' ? 'default' : 'outline'}
                className="cursor-pointer text-base"
                onClick={() => setSelectedDifficulty('hard')}
              >
                {t('difficultyHard')}
              </Badge>
            </div>
          </div>

          <div>
            <p className="text-base font-medium text-gray-500 mb-2">{t('filterByAccessibility')}</p>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={selectedTravelTime === 'all' ? 'default' : 'outline'}
                className="cursor-pointer text-base"
                onClick={() => setSelectedTravelTime('all')}
              >
                {t('filterAll')}
              </Badge>
              <Badge 
                variant={selectedTravelTime === 'direct-access' ? 'default' : 'outline'}
                className="cursor-pointer text-base"
                onClick={() => setSelectedTravelTime('direct-access')}
              >
                {t('accessibilityDirect')}
              </Badge>
              <Badge 
                variant={selectedTravelTime === 'easy-access' ? 'default' : 'outline'}
                className="cursor-pointer text-base"
                onClick={() => setSelectedTravelTime('easy-access')}
              >
                {t('accessibilityEasy')}
              </Badge>
              <Badge 
                variant={selectedTravelTime === 'medium-access' ? 'default' : 'outline'}
                className="cursor-pointer text-base"
                onClick={() => setSelectedTravelTime('medium-access')}
              >
                {t('accessibilityMedium')}
              </Badge>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>{t('apply')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FiltersDialog;
