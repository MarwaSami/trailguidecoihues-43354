
import React from 'react';
import { Beach } from '../types/beach';
import { useLanguage } from '../context/LanguageContext';
import BeachCard from './BeachCard';
import { useIsMobile } from '../hooks/use-mobile';

interface BeachesSectionProps {
  beaches: Beach[];
  showSection: boolean;
}

const BeachesSection: React.FC<BeachesSectionProps> = ({ 
  beaches, 
  showSection 
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  if (!showSection) {
    return null;
  }

  const headingClasses = isMobile 
    ? "text-3xl font-bold text-black mb-6 text-center" 
    : "text-3xl font-bold text-black mb-6";

  return (
    <div className="mb-12 mt-16">
      <h2 className={headingClasses}>{t('beaches')}</h2>
      {beaches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beaches.map((beach) => (
            <BeachCard key={beach.id} beach={beach} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">{t('noBeachesFound')}</p>
      )}
    </div>
  );
};

export default BeachesSection;
