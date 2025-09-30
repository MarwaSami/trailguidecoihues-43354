import React from 'react';
import { Bus, Car, Footprints, ThumbsUp, Users } from 'lucide-react';
import { Trail, TransportationType } from '../../types/trail';
import { useLanguage } from '../../context/LanguageContext';

interface TransportationInfoProps {
  trail: Trail;
  compact?: boolean;
}

const TransportationInfo: React.FC<TransportationInfoProps> = ({ trail, compact = false }) => {
  const { t } = useLanguage();

  // Special handling for Jakob trail
  if (trail.id === "11" || trail.name.toLowerCase().includes("jakob")) {
    if (trail.id === "17" || trail.name === "Refugio San Martin Jakob") {
      return (
        <div className={compact ? "space-y-2" : "space-y-3 bg-gray-50 p-4 rounded-lg"}>
          <div className="flex items-start gap-2">
            <Car className="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5" />
            <div>
              <span className="font-bold block">{t('taxiService')} (16 {t('minutes')})</span>
              {!compact && <span className="text-gray-600">{t('taxiAvailable')}</span>}
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className={compact ? "space-y-2" : "space-y-3 bg-gray-50 p-4 rounded-lg"}>
        <div className="flex items-start gap-2">
          <Footprints className="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5" />
          <div>
            <span className="font-bold block">{t('walkingDistance')}</span>
            {!compact && <span className="text-gray-600">{t('directAccess')}</span>}
          </div>
        </div>
      </div>
    );
  }

  // Special handling for Refugio Cerro López trail
  if (trail.id === "18" || trail.name === "Refugio Cerro López") {
    return (
      <div className={compact ? "space-y-2" : "space-y-3 bg-gray-50 p-4 rounded-lg"}>
        <div className="flex items-start gap-2">
          <Bus className="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5" />
          <div>
            <span className="font-bold block">{t('busService')} - {trail.busLines}</span>
            {!compact && <span className="text-gray-600">{t('busLines')}: Linea 50 + Linea 10 o 13</span>}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Car className="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5" />
          <div>
            <span className="font-bold block">{t('taxiService')} (30 {t('minutes')})</span>
            {!compact && <span className="text-gray-600">{t('taxiAvailable')}</span>}
          </div>
        </div>
      </div>
    );
  }
  
  // Special handling for Pampa Linda trails
  if (trail.region === "pampa-linda" || 
      ["14", "15", "16"].includes(trail.id) || 
      ["Refugio Otto Meiling", "Laguna Ilón", "Refugio Agostino Rocca"].includes(trail.name)) {
    return (
      <div className={compact ? "space-y-2" : "space-y-3 bg-gray-50 p-4 rounded-lg"}>
        <div className="flex items-start gap-2">
          <Users className="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5" />
          <div>
            <span className="font-bold block">{t('transferService')} (2 {t('hours')})</span>
            {!compact && <span className="text-gray-600">{t('transferAvailable')}</span>}
          </div>
        </div>
      </div>
    );
  }
  
  // Special handling for Cerro López-Laguna Negra trail
  if (trail.id === "19" || trail.name === "Travesía Cerro López – Laguna Negra") {
    return (
      <div className={compact ? "space-y-2" : "space-y-3 bg-gray-50 p-4 rounded-lg"}>
        <div className="flex items-start gap-2">
          <Bus className="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5" />
          <div>
            <span className="font-bold block">{t('busService')} - {trail.busLines}</span>
            {!compact && <span className="text-gray-600">{t('busLines')}: Linea 50 (los Coihues) + Linea 10 (desde Av. Bustillo km 8) hasta la Panchería del Circuito Chico (1hr)</span>}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Car className="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5" />
          <div>
            <span className="font-bold block">{t('taxiService')} (40 {t('minutes')})</span>
            {!compact && <span className="text-gray-600">{t('taxiAvailable')}</span>}
          </div>
        </div>
      </div>
    );
  }
  
  // Special handling for Cerro Llao Llao trail
  if (trail.id === "2" || trail.name === "Cerro Llao Llao") {
    return (
      <div className={compact ? "space-y-2" : "space-y-3 bg-gray-50 p-4 rounded-lg"}>
        <div className="flex items-start gap-2">
          <Bus className="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5" />
          <div>
            <span className="font-bold block">{t('busService')} - {trail.busLines}</span>
            {!compact && <span className="text-gray-600">{t('busLines')}: {trail.busLines}</span>}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Car className="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5" />
          <div>
            <span className="font-bold block">{t('taxiService')} (35 {t('minutes')})</span>
            {!compact && <span className="text-gray-600">{t('taxiAvailable')}</span>}
          </div>
        </div>
      </div>
    );
  }
  
  // Special handling for the updated trails with specific taxi times
  if (trail.id === "8" || trail.name === "Cerro Campanario") {
    return (
      <div className={compact ? "space-y-2" : "space-y-3 bg-gray-50 p-4 rounded-lg"}>
        <div className="flex items-start gap-2">
          <Bus className="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5" />
          <div>
            <span className="font-bold block">{t('busService')} - {trail.busLines}</span>
            {!compact && <span className="text-gray-600">{t('busLines')}: {trail.busLines}</span>}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Car className="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5" />
          <div>
            <span className="font-bold block">{t('taxiService')} (35 {t('minutes')})</span>
            {!compact && <span className="text-gray-600">{t('taxiAvailable')}</span>}
          </div>
        </div>
      </div>
    );
  }
  
  if (trail.id === "9" || trail.name === "Circuito Chico - Lago Moreno") {
    return (
      <div className={compact ? "space-y-2" : "space-y-3 bg-gray-50 p-4 rounded-lg"}>
        <div className="flex items-start gap-2">
          <Bus className="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5" />
          <div>
            <span className="font-bold block">{t('busService')} - {trail.busLines}</span>
            {!compact && <span className="text-gray-600">{t('busLines')}: {trail.busLines}</span>}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Car className="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5" />
          <div>
            <span className="font-bold block">{t('taxiService')} (30 {t('minutes')})</span>
            {!compact && <span className="text-gray-600">{t('taxiAvailable')}</span>}
          </div>
        </div>
      </div>
    );
  }
  
  if (trail.id === "10" || trail.name === "Colonia Suiza") {
    return (
      <div className={compact ? "space-y-2" : "space-y-3 bg-gray-50 p-4 rounded-lg"}>
        <div className="flex items-start gap-2">
          <Bus className="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5" />
          <div>
            <span className="font-bold block">{t('busService')} - {trail.busLines}</span>
            {!compact && <span className="text-gray-600">{t('busLines')}: {trail.busLines}</span>}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Car className="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5" />
          <div>
            <span className="font-bold block">{t('taxiService')} (35 {t('minutes')})</span>
            {!compact && <span className="text-gray-600">{t('taxiAvailable')}</span>}
          </div>
        </div>
      </div>
    );
  }
  
  if (trail.id === "21" || trail.name === "Mirador Brazo Tristeza, Lago Escondido & Bahía López") {
    return (
      <div className={compact ? "space-y-2" : "space-y-3 bg-gray-50 p-4 rounded-lg"}>
        <div className="flex items-start gap-2">
          <Bus className="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5" />
          <div>
            <span className="font-bold block">{t('busService')} - {trail.busLines}</span>
            {!compact && <span className="text-gray-600">{t('busLines')}: {trail.busLines}</span>}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Car className="w-4 h-4 flex-shrink-0 text-blue-500 mt-0.5" />
          <div>
            <span className="font-bold block">{t('taxiService')} (35 {t('minutes')})</span>
            {!compact && <span className="text-gray-600">{t('taxiAvailable')}</span>}
          </div>
        </div>
      </div>
    );
  }

  const getTransportationInfo = (type: string) => {
    const getTimeLabel = (minutes: number) => `(${minutes} ${t('minutes')})`;

    switch (type) {
      case 'walking':
        return {
          icon: <Footprints className="w-4 h-4 flex-shrink-0 text-blue-500" />,
          label: `${t('walkingDistance')}`
        };
      case 'bus':
        return {
          icon: <Bus className="w-4 h-4 flex-shrink-0 text-blue-500" />,
          label: `${t('busService')} - ${trail.busLines || 'Line 20'}`
        };
      case 'taxi':
        return {
          icon: <Car className="w-4 h-4 flex-shrink-0 text-blue-500" />,
          label: `${t('taxiService')} ${getTimeLabel(15)}`
        };
      case 'private-transfer':
        return {
          icon: <Users className="w-4 h-4 flex-shrink-0 text-blue-500" />,
          label: `${t('privateTransfer')} ${getTimeLabel(Math.round(trail.distanceFromCampsite * 2))}`
        };
      case 'hitchhiking':
        return {
          icon: <ThumbsUp className="w-4 h-4 flex-shrink-0 text-blue-500" />,
          label: t('hitchhiking')
        };
      default:
        return null;
    }
  };

  const getBusInfo = (trail: Trail) => {
    if (trail.name === "Refugio Frey from Villa Catedral") {
      return "Linea 50 (desde Coihues hasta km 8 ruta 82) + Linea 55 (Ruta 82)";
    }
    
    if (!trail.transportation.includes('bus')) return null;
    
    switch(trail.id) {
      case 't1': // Cerro Llao Llao
        return "Bus 20";
      case 't2': // Cerro Lopez
        return "Bus 20, 21";
      case 't3': // Refugio Frey
        return "Bus 55";
      case 't4': // Cerro Campanario
        return "Bus 20, 21";
      case 't5': // Laguna Negra
        return "Bus 55";
      case 't6': // Cerro Catedral
        return "Bus 55";
      case 't7': // Circuito Chico
        return "Bus 20";
      case 't8': // Cascada de los Duendes
        return "Walking distance";
      case 't9': // Lago Escondido
        return "Bus 20";
      case 't10': // Mirador Lago Gutiérrez
        return "Walking distance";
      case 't11': // Cerro San Martín
        return "Walking distance";
      case 't12': // Refugio Otto Meiling
        return "Bus 50 + Pampa Linda Transfer";
      case 't13': // Refugio San Martín
        return "Bus 50 + Pampa Linda Transfer";
      case 't14': // Cerro Tronador
        return "Bus 50 + Pampa Linda Transfer";
      default:
        return null;
    }
  };

  return (
    <div className={compact ? "space-y-2" : "space-y-3 bg-gray-50 p-4 rounded-lg"}>
      {trail.transportation.map((type, index) => {
        const transportInfo = getTransportationInfo(type);
        if (!transportInfo) return null;
        return (
          <div key={index} className="flex items-start gap-2">
            <div className="mt-0.5">{transportInfo.icon}</div>
            <div>
              <span className="font-bold block">{transportInfo.label}</span>
              {type === 'bus' && !compact && (
                <span className="text-gray-600">{t('busLines')}: {getBusInfo(trail)}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransportationInfo;
