
import React from 'react';
import { Trail } from '../types/trail';
import { useLanguage } from '../context/LanguageContext';
import TrailCard from './TrailCard';
import { getTransportIcon } from '../utils/transportationIcons';
import { useIsMobile } from '../hooks/use-mobile';
import { Button } from './ui/button';
import { ExternalLink } from 'lucide-react';

interface MultiDayHikesSectionProps {
  otherMultiDayHikes: Trail[];
  pampLindaHikes: Trail[];
  showSection: boolean;
}

const MultiDayHikesSection: React.FC<MultiDayHikesSectionProps> = ({ 
  otherMultiDayHikes, 
  pampLindaHikes, 
  showSection 
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  if (!showSection) {
    return null;
  }

  // Find specific trails for debugging
  const hasJakobCircuit = otherMultiDayHikes.find(trail => 
    trail.id === "11" || 
    (trail.name.toLowerCase().includes('jakob') && trail.name.toLowerCase().includes('frey'))
  );
  
  const hasJakobTambo = otherMultiDayHikes.find(trail => 
    trail.id === "12" || 
    (trail.name.toLowerCase().includes('jakob') && trail.name.toLowerCase().includes('tambo'))
  );

  // Check for trails that should be in Pampa Linda only
  const hasAgostinoRocca = otherMultiDayHikes.find(trail => trail.id === "16");
  const hasOttoMeiling = otherMultiDayHikes.find(trail => trail.id === "14");
  const hasLagunaIlon = otherMultiDayHikes.find(trail => trail.id === "15");
  
  // Check for trails that should be excluded completely from multi-day
  const hasPlayaMunoz = otherMultiDayHikes.find(trail => trail.name === "Playa Muñoz");
  const hasCascadaDuendes = otherMultiDayHikes.find(trail => trail.name === "Cascada de los Duendes");
  
  // Get IDs of excluded trails for debugging
  const playaMunozId = otherMultiDayHikes.find(trail => trail.name === "Playa Muñoz")?.id;
  const cascadaDuendesId = otherMultiDayHikes.find(trail => trail.name === "Cascada de los Duendes")?.id;
  
  // Log for debugging
  console.log('Agostino Rocca in Bariloche:', hasAgostinoRocca ? 'Yes (ERROR)' : 'No (CORRECT)');
  console.log('Otto Meiling in Bariloche:', hasOttoMeiling ? 'Yes (ERROR)' : 'No (CORRECT)');
  console.log('Laguna Ilón in Bariloche:', hasLagunaIlon ? 'Yes (ERROR)' : 'No (CORRECT)');
  console.log('Playa Muñoz in Bariloche:', hasPlayaMunoz ? 'Yes (ERROR)' : 'No (CORRECT)');
  console.log('Cascada de los Duendes in Bariloche:', hasCascadaDuendes ? 'Yes (ERROR)' : 'No (CORRECT)');
  console.log('Playa Muñoz ID:', playaMunozId || 'Not found');
  console.log('Cascada de los Duendes ID:', cascadaDuendesId || 'Not found');

  const headingClasses = isMobile 
    ? "text-3xl font-bold text-black mb-6 text-center" 
    : "text-3xl font-bold text-black mb-6";

  const subheadingClasses = isMobile 
    ? "text-2xl font-semibold text-forest-light mb-4 border-l-4 border-forest pl-3 text-center" 
    : "text-2xl font-semibold text-forest-light mb-4 border-l-4 border-forest pl-3";
  
  return (
    <div className="mb-12">
      <h2 className={headingClasses}>{t('filterMultiDay')}</h2>
      
      {/* Registration Form Section */}
      <div className="mb-6">
        <div className="flex flex-col items-start">
          <Button
            variant="region"
            className="flex items-center gap-2 uppercase mb-2"
            onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLScL5EuxLZGDb0tOrAsg9Bgm3-C5FFcvpmDncHzSo9NSI3v4sw/viewform', '_blank', 'noopener,noreferrer')}
          >
            {t('registrationFormButton')}
            <ExternalLink size={16} />
          </Button>
          <p className="text-sm text-amber-800">
            {t('registrationFormText')}
          </p>
        </div>
      </div>
      
      {otherMultiDayHikes.length > 0 && (
        <div className="mb-8">
          <h3 className={subheadingClasses}>
            {t('bariloche')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherMultiDayHikes.map((trail) => (
              <TrailCard 
                key={trail.id} 
                trail={trail}
                transportIcons={trail.transportation.map(t => getTransportIcon(t))}
              />
            ))}
          </div>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-2 bg-gray-100 text-xs">
              <p>Debug - Bariloche multi-day hikes:</p>
              <p>Found Jakob Circuit (id=11): {hasJakobCircuit ? 'Yes' : 'No'}</p>
              <p>Found Jakob Tambo (id=12): {hasJakobTambo ? 'Yes' : 'No'}</p>
              <p>Agostino Rocca in Bariloche: {hasAgostinoRocca ? 'Yes (ERROR)' : 'No (CORRECT)'}</p>
              <p>Otto Meiling in Bariloche: {hasOttoMeiling ? 'Yes (ERROR)' : 'No (CORRECT)'}</p>
              <p>Laguna Ilón in Bariloche: {hasLagunaIlon ? 'Yes (ERROR)' : 'No (CORRECT)'}</p>
              <p>Playa Muñoz in Bariloche: {hasPlayaMunoz ? 'Yes (ERROR)' : 'No (CORRECT)'}</p>
              <p>Cascada de los Duendes in Bariloche: {hasCascadaDuendes ? 'Yes (ERROR)' : 'No (CORRECT)'}</p>
              <p>Total trails: {otherMultiDayHikes.length}</p>
              <p>Trail IDs: {otherMultiDayHikes.map(t => t.id).join(', ')}</p>
              <p>Trail names: {otherMultiDayHikes.map(t => t.name).join(', ')}</p>
            </div>
          )}
        </div>
      )}
      
      {pampLindaHikes.length > 0 && (
        <div>
          <h3 className={subheadingClasses}>
            {t('pampLinda')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pampLindaHikes.map((trail) => (
              <TrailCard 
                key={trail.id} 
                trail={trail}
                transportIcons={trail.transportation.map(t => getTransportIcon(t))}
              />
            ))}
          </div>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-2 bg-gray-100 text-xs">
              <p>Debug - Pampa Linda trails:</p>
              <p>Total trails: {pampLindaHikes.length}</p>
              <p>Trail IDs: {pampLindaHikes.map(t => t.id).join(', ')}</p>
              <p>Has Agostino Rocca (id=16): {pampLindaHikes.some(t => t.id === "16") ? 'Yes' : 'No'}</p>
              <p>Has Otto Meiling (id=14): {pampLindaHikes.some(t => t.id === "14") ? 'Yes' : 'No'}</p>
              <p>Has Laguna Ilón (id=15): {pampLindaHikes.some(t => t.id === "15") ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiDayHikesSection;
