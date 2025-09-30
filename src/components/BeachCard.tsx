
import React, { useState } from 'react';
import { Beach } from '../types/beach';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Map, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { getTransportIcon } from '../utils/transportationIcons';

interface BeachCardProps {
  beach: Beach;
}

const BeachCard: React.FC<BeachCardProps> = ({ beach }) => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const getBeachTypeTranslation = (type: string) => {
    switch (type) {
      case 'sandy': return t('sandy');
      case 'rocky': return t('rocky');
      case 'mixed': return t('mixed');
      case 'pebbly': return t('pebbly');
      default: return type;
    }
  };

  const getBusInfo = (beach: Beach) => {
    if (!beach.transportation.includes('bus')) return null;
    
    // Map beaches to specific bus lines and info
    switch(beach.id) {
      case 'b1': // Playa Del Viento
        return "Linea 50 (Desde Coihues) conexión en Av. Pioneros y Rotonda + Linea 21 (desde Av. Bustillo Km 8) (50 min)";
      case 'b2': // Playa Con Viento
        return "Linea 50 (Desde Coihues) conexión en Av. Pioneros y Rotonda + Linea 10 o 13 (desde Av. Bustillo Km 8) (50 min)";
      case 'b3': // Playa Sin Viento
        return "Linea 50 (Desde Coihues) conexión en Av. Pioneros y Rotonda + Linea 10 o 13 (desde Av. Bustillo Km 8) (50 min)";
      case 'b5': // Playa Bonita
        return "Linea 50 (Desde Coihues hasta Rotonda Av. Pioneros) (15 min)";
      case 'b6': // Playa Serena
        return "Linea 50 (Desde Coihues hasta Rotonda Av. Pioneros) Linea 20 (km. 13 Av. Bustillo) (30 min)";
      case 'b7': // Bahia Lopez
        return "Linea 50 (Desde Coihues hasta Rotonda Av. Pioneros) + Linea 10 (1 hr)";
      case 'b8': // Villa Tacul
        return "Linea 50 (Desde Coihues hasta Rotonda Av. Pioneros) + Linea 20 hasta Llao Llao (1 hr)";
      case 'b9': // Playa Melipal
        return "Linea 50 (Desde Coihues hasta Terminal) + Linea 20 o 21 (km. 4 Av. Bustillo) (25 min)";
      default:
        return null;
    }
  };

  return (
    <>
      <Card 
        className="group hover:shadow-lg transition-all duration-300 animate-fadeIn cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative overflow-hidden rounded-t-lg h-48">
          <img
            src={beach.imageUrl}
            alt={beach.name}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
          />
          {/* Removed the beach type badge here */}
        </div>
        
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{beach.name}</CardTitle>
          <CardDescription className="flex items-center gap-2 mt-1">
            <Map className="w-4 h-4" /> {beach.location}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm">{beach.travelTime} {t('minutes')} {t('fromCampsite')}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2">{beach.description[language]}</p>
          
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">{t('howToGetThere')}</h4>
            <div className="flex flex-wrap gap-2">
              {beach.transportation.map((transport, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1 text-xs">
                  {getTransportIcon(transport)}
                  <span>{t(transport === 'private-transfer' ? 'privateTransfer' : transport)}</span>
                </Badge>
              ))}
            </div>
            
            {getBusInfo(beach) && (
              <div className="mt-2 text-sm text-blue-600">
                <span className="font-medium">{t('busLines')}: </span>
                {getBusInfo(beach)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{beach.name}</DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-base">
              <Map className="w-4 h-4" /> {beach.location}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <img
              src={beach.imageUrl}
              alt={beach.name}
              className="w-full h-64 object-cover object-center rounded-lg mb-6"
            />
            
            <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-semibold">{t('travelTime')}</p>
                  <p className="text-base">{beach.travelTime} {t('minutes')} {t('fromCampsite')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-semibold">{t('beachType')}</p>
                  <p className="text-base">{getBeachTypeTranslation(beach.beachType)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('description')}</h3>
                <p className="text-gray-700">{beach.description[language]}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">{t('howToGetThere')}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {beach.transportation.map((transport, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {getTransportIcon(transport)}
                      <span>{t(transport === 'private-transfer' ? 'privateTransfer' : transport)}</span>
                    </Badge>
                  ))}
                </div>
                
                {getBusInfo(beach) && (
                  <div className="mt-2 bg-blue-50 p-3 rounded-md">
                    <p className="font-medium">{t('busLines')}: {getBusInfo(beach)}</p>
                    <p className="text-sm mt-1">{t('checkSchedules')}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">{t('facilities')}</h3>
                <div className="flex flex-wrap gap-2">
                  {beach.facilities.map((facility, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      <Map className="w-4 h-4" />
                      <span>{t(facility)}</span>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">{t('bestTimeToVisit')}</h3>
                <p className="text-gray-700">{beach.bestTimeToVisit}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BeachCard;
