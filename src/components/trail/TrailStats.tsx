
import React from 'react';
import { ArrowUpRight, Clock, Mountain, TrendingUp } from 'lucide-react';
import { Trail } from '../../types/trail';
import { useLanguage } from '../../context/LanguageContext';

interface TrailStatsProps {
  trail: Trail;
  layout?: 'grid' | 'column';
  size?: 'sm' | 'md' | 'lg';
}

const TrailStats: React.FC<TrailStatsProps> = ({ 
  trail, 
  layout = 'grid',
  size = 'sm'
}) => {
  const { t, language } = useLanguage();

  const formatDistance = (trail: Trail) => {
    if (trail.name === "Lago Gutiérrez") {
      return `${trail.distance * 1000} ${t('meters')}`;
    }
    return `${trail.distance} ${t('km')}`;
  };

  const formatDuration = (trail: Trail) => {
    const oneWayText = language === 'es' ? "ida" : "one way";
    
    if (trail.name === "Cerro Otto & Piedra de Habsburgo") {
      return language === 'es' ? "2 horas ida" : "2 hours one way";
    }
    
    if (trail.name === "Refugio Frey from Villa Catedral") {
      return language === 'es' ? `3 horas ${oneWayText}` : `3 ${t('hours')} ${oneWayText}`;
    }
    
    if (trail.name === "Refugio Laguna Negra desde Colonia Suiza") {
      return language === 'es' ? `3 horas ${oneWayText}` : `3 ${t('hours')} ${oneWayText}`;
    }
    
    if (trail.name.includes("Jakob")) {
      return language === 'es' ? `5-6 horas ${oneWayText}` : `5-6 ${t('hours')} ${oneWayText}`;
    }
    
    if (trail.name === "Lago Gutiérrez" || trail.name === "Cascada de los Duendes" || 
        (trail.name === "Cerro Campanario" && trail.duration === 0.75)) {
      return `${Math.round(trail.duration * 60)} ${t('minutes')} ${oneWayText}`;
    }

    if (language === 'es') {
      return `${trail.duration} ${trail.duration === 1 ? 'hora' : 'horas'} ${oneWayText}`;
    }
    
    return `${trail.duration} ${t('hours')} ${oneWayText}`;
  };

  const getElevation = (trail: Trail) => {
    if (trail.name === "Refugio Frey from Villa Catedral") {
      return 1080;
    }
    if (trail.name.includes("Jakob")) {
      return 1600;
    }
    return trail.elevation;
  };

  const getElevationGain = (trail: Trail) => {
    if (trail.name === "Refugio Frey desde Lago Gutierrez" || trail.name === "Refugio Frey from Lago Gutierrez") {
      return 975;
    }
    return trail.elevationGain || 0;
  };

  const sizeClasses = {
    sm: {
      container: '',
      icon: 'w-4 h-4',
      text: 'text-base font-semibold',
    },
    md: {
      container: 'gap-3',
      icon: 'w-5 h-5',
      text: 'text-lg font-semibold',
    },
    lg: {
      container: 'gap-3',
      icon: 'w-6 h-6',
      text: 'text-xl font-bold',
    },
  };

  const calculateVisibleStats = () => {
    let count = 0;
    if (trail.distance > 0) count++;
    if (trail.duration > 0 || trail.name === "Cerro Otto & Piedra de Habsburgo") count++;
    if (trail.elevation > 0) count++;
    // Always count elevation gain now
    count++;
    return count;
  };

  const getGridLayout = () => {
    const visibleStats = calculateVisibleStats();
    
    if (visibleStats <= 2) return 'grid-cols-2';
    
    return 'grid-cols-2';
  };

  const containerClass = layout === 'grid' 
    ? `grid ${getGridLayout()} gap-x-4 gap-y-3 ${sizeClasses[size].container}`
    : `flex flex-col items-center gap-2 ${sizeClasses[size].container}`;

  const iconClasses = `${sizeClasses[size].icon} flex-shrink-0 text-blue-500`;
  const textClasses = sizeClasses[size].text;

  // Define trails that should always show elevation gain even when it's 0
  const alwaysShowElevationGainTrails = [
    "Lago Gutiérrez",
    "Cascada de los Duendes",
    "Colonia Suiza"
  ];

  // Check if the current trail should always show elevation gain
  const shouldShowElevationGain = getElevationGain(trail) > 0 || alwaysShowElevationGainTrails.includes(trail.name);

  return (
    <div className={containerClass}>
      {trail.distance > 0 && (
        <div className="flex items-center gap-2">
          <ArrowUpRight className={iconClasses} />
          <span className={textClasses}>{formatDistance(trail)}</span>
        </div>
      )}
      {(trail.duration > 0 || trail.name === "Cerro Otto & Piedra de Habsburgo") && (
        <div className="flex items-center gap-2">
          <Clock className={iconClasses} />
          <span className={textClasses}>
            {formatDuration(trail)}
          </span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Mountain className={iconClasses} />
        <span className={textClasses}>{getElevation(trail)}m</span>
      </div>
      {shouldShowElevationGain && (
        <div className="flex items-center gap-2">
          <TrendingUp className={iconClasses} />
          <span className={textClasses}>{getElevationGain(trail)}m↑</span>
        </div>
      )}
    </div>
  );
};

export default TrailStats;
