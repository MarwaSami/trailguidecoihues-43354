
import { useLanguage } from '../context/LanguageContext';
import { trails } from '../data/trails';
import { Trail, TrailType } from '../types/trail';

export const useTrailLists = (allHikes: Trail[], dayHikes: Trail[], multiDayHikes: Trail[]) => {
  const { language } = useLanguage();

  const getAllTrails = () => {
    return trails.map(trail => ({
      ...trail,
      description: {
        en: trail.description.en,
        es: trail.description.es
      }
    }));
  };

  const getTrailsByType = (type: TrailType) => {
    return trails
      .filter(trail => trail.type === type)
      .map(trail => ({
        ...trail,
        description: {
          en: trail.description.en,
          es: trail.description.es
        }
      }));
  };

  const getTrailsByCategory = (category: string) => {
    return trails
      .filter(trail => trail.category === category)
      .map(trail => ({
        ...trail,
        description: {
          en: trail.description.en,
          es: trail.description.es
        }
      }));
  };

  const getLocalizedTrailDescription = (trail: Trail) => {
    return language === 'en' ? trail.description.en : trail.description.es;
  };

  const directAccessHikes = dayHikes.filter(trail => trail.distanceFromCampsite <= 2);
  const otherDayHikes = dayHikes.filter(trail => trail.distanceFromCampsite > 2);
  const pampLindaHikes = multiDayHikes.filter(trail => trail.region === 'pampa-linda');
  const otherMultiDayHikes = multiDayHikes.filter(trail => trail.region !== 'pampa-linda');
  const categoryBarilochieHikes = allHikes.filter(trail => trail.region === 'bariloche');
  const categoryPampLindaHikes = allHikes.filter(trail => trail.region === 'pampa-linda');

  return {
    getAllTrails,
    getTrailsByType,
    getTrailsByCategory,
    getLocalizedTrailDescription,
    directAccessHikes,
    otherDayHikes,
    pampLindaHikes,
    otherMultiDayHikes,
    categoryBarilochieHikes,
    categoryPampLindaHikes
  };
};
