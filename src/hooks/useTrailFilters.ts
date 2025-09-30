
import { useState } from 'react';
import { Trail, TrailType, Difficulty, TransportationType, TravelTimeCategory, TrailCategory } from '../types/trail';
import { Beach } from '../types/beach';

export const useTrailFilters = (trails: Trail[], beaches: Beach[]) => {
  const [selectedType, setSelectedType] = useState<TrailType | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedTravelTime, setSelectedTravelTime] = useState<TravelTimeCategory | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<TrailCategory | 'all'>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const getAccessibilityCategory = (trail: Trail): TravelTimeCategory => {
    if (trail.distanceFromCampsite <= 2) return 'direct-access';
    if (trail.travelTime <= 30 && ['bus', 'taxi'].some(t => trail.transportation.includes(t as TransportationType))) {
      return 'easy-access';
    }
    return 'medium-access';
  };

  const filteredTrails = trails.filter(trail => {
    const typeMatch = selectedType === 'all' || trail.type === selectedType;
    const difficultyMatch = selectedDifficulty === 'all' || trail.difficulty === selectedDifficulty;
    const accessibilityMatch = selectedTravelTime === 'all' || getAccessibilityCategory(trail) === selectedTravelTime;
    const categoryMatch = selectedCategory === 'all' || trail.category === selectedCategory || 
      (selectedCategory === 'nearby' && trail.distanceFromCampsite <= 1);
    return typeMatch && difficultyMatch && accessibilityMatch && categoryMatch;
  });

  const filteredBeaches = beaches.filter(beach => {
    if (selectedCategory === 'beaches-lakes') return true;
    
    const showAllCategories = selectedCategory === 'all';
    const travelTimeMatch = selectedTravelTime === 'all' || 
      (selectedTravelTime === 'direct-access' && beach.distanceFromCampsite <= 2) ||
      (selectedTravelTime === 'easy-access' && beach.travelTime <= 30) ||
      (selectedTravelTime === 'medium-access' && beach.travelTime > 30);
    
    return showAllCategories && travelTimeMatch;
  });

  const allHikes = filteredTrails;
  const dayHikes = filteredTrails.filter(trail => trail.type === 'day-hike');
  const multiDayHikes = filteredTrails.filter(trail => trail.type === 'multi-day');

  return {
    filters: {
      selectedType,
      setSelectedType,
      selectedDifficulty,
      setSelectedDifficulty,
      selectedTravelTime,
      setSelectedTravelTime,
      selectedCategory,
      setSelectedCategory,
      filtersOpen,
      setFiltersOpen,
    },
    getAccessibilityCategory,
    filteredTrails,
    filteredBeaches,
    allHikes,
    dayHikes,
    multiDayHikes,
  };
};
