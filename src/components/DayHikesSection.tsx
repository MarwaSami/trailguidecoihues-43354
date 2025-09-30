
import React from 'react';
import { Trail } from '../types/trail';
import { useLanguage } from '../context/LanguageContext';
import TrailCard from './TrailCard';
import { getTransportIcon } from '../utils/transportationIcons';
import { useIsMobile } from '../hooks/use-mobile';

interface DayHikesSectionProps {
  directAccessHikes: Trail[];
  otherDayHikes: Trail[];
  showSection: boolean;
}

const DayHikesSection: React.FC<DayHikesSectionProps> = ({ 
  directAccessHikes, 
  otherDayHikes, 
  showSection 
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  if (!showSection) {
    return null;
  }

  // Function to sort direct access trails with specific positions
  const sortedDirectAccessHikes = [...directAccessHikes].sort((a, b) => {
    // First, check if it's Cerro San Martin (ID 4)
    if (a.id === "4") return -1;
    if (b.id === "4") return 1;
    
    // Refugio Frey desde Lago Gutierrez (ID 19) should be the 5th card
    // In a sort function, we want to prioritize it lower than the first 4 cards
    // but higher than the rest of the cards
    
    // If neither trail is ID 19, maintain normal sort order
    if (a.id !== "19" && b.id !== "19") return 0;
    
    // If trail A is ID 19, it should appear after non-ID-19 trails
    // (except ID 4 which is handled above)
    if (a.id === "19") return 4; // This gives it the 5th position (index 4)
    
    // If trail B is ID 19, other trails should appear before it
    if (b.id === "19") return -4;
    
    // For all other trails, maintain original order
    return 0;
  });

  const headingClasses = isMobile 
    ? "text-3xl font-bold text-black mb-6 text-center" 
    : "text-3xl font-bold text-black mb-6";

  const subheadingClasses = isMobile 
    ? "text-2xl font-semibold text-forest-light mb-4 border-l-4 border-forest pl-3 text-center" 
    : "text-2xl font-semibold text-forest-light mb-4 border-l-4 border-forest pl-3";

  return (
    <div className="mb-12">
      <h2 className={headingClasses}>{t('filterDayHike')}</h2>
      
      {directAccessHikes.length > 0 && (
        <div className="mb-8">
          <h3 className={subheadingClasses}>
            {t('accessibilityDirect')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDirectAccessHikes.map((trail) => (
              <TrailCard 
                key={`direct-${trail.id}`} 
                trail={trail} 
                transportIcons={trail.transportation.map(t => getTransportIcon(t))}
              />
            ))}
          </div>
        </div>
      )}
      
      {otherDayHikes.length > 0 && (
        <div>
          {directAccessHikes.length > 0 && (
            <h3 className={subheadingClasses}>
              {t('nearByBusOrUber')}
            </h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherDayHikes.map((trail) => (
              <TrailCard 
                key={`bus-${trail.id}`} 
                trail={trail}
                transportIcons={trail.transportation.map(t => getTransportIcon(t))}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DayHikesSection;
