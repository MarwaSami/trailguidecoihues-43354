
import React, { useState } from 'react';
import { Trail } from '../types/trail';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { MapPin, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import DifficultyBadge from './trail/DifficultyBadge';
import ReservationBadge from './trail/ReservationBadge';
import TrailStats from './trail/TrailStats';
import TrailDescription from './trail/TrailDescription';
import TransportationInfo from './trail/TransportationInfo';
import TrailDetailDialog from './trail/TrailDetailDialog';
import { Button } from './ui/button';

interface TrailCardProps {
  trail: Trail;
  transportIcons?: React.ReactNode[];
}

const TrailCard: React.FC<TrailCardProps> = ({ trail, transportIcons }) => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Special handling for Jakob trails to ensure they're displayed correctly
  const isJakobCircuitTrail = trail.id === "11" || 
    (trail.name.toLowerCase().includes('jakob') && trail.name.toLowerCase().includes('frey'));
  
  const isJakobTamboTrail = trail.id === "12" || 
    (trail.name.toLowerCase().includes('jakob') && trail.name.toLowerCase().includes('tambo'));
  
  const isJakobRefugioTrail = trail.id === "17" || 
    trail.name === "Refugio San Martin Jakob";
    
  const isRefugioCerroLopez = trail.id === "18" || 
    trail.name === "Refugio Cerro López";
    
  // Special handling for Refugio Frey trail
  const isRefugioFreyTrail = trail.id === "11" || 
    trail.name.toLowerCase().includes('refugio frey') || 
    (trail.name.toLowerCase().includes('frey') && !trail.name.toLowerCase().includes('jakob'));
  
  // Special handling for Pampa Linda trails
  const isPampaLindaTrail = trail.region === "pampa-linda" || 
    ["14", "15", "16"].includes(trail.id) ||
    ["Refugio Otto Meiling", "Laguna Ilón", "Refugio Agostino Rocca"].includes(trail.name);
  
  // Special handling for Laguna Ilón trail
  const isLagunaIlonTrail = trail.id === "15" || 
    trail.name === "Laguna Ilón";
  
  // Special handling for Refugio Otto Meiling trail
  const isRefugioOttoMeiling = trail.id === "14" || 
    trail.name === "Refugio Otto Meiling";
  
  // Special handling for Refugio Laguna Negra trail
  const isRefugioLagunaNegra = trail.id === "13" || 
    trail.name.toLowerCase().includes('laguna negra');
  
  // Special handling for Refugio Agostino Rocca trail
  const isRefugioAgostinoRocca = trail.id === "16" || 
    trail.name === "Refugio Agostino Rocca";
  
  // Identify trails to exclude from reservation buttons
  const isCerroSanMartin = trail.id === "t11" || trail.name === "Cerro San Martín";
  const isTraversiaLopezNegra = trail.name === "Travesía Cerro López - Laguna Negra";
  
  // Combined check for trails that should not show reservation buttons
  const shouldExcludeReservationButton = isCerroSanMartin || isTraversiaLopezNegra;
  
  const getDefaultImage = () => {
    if (isJakobCircuitTrail) return "/lovable-uploads/3b45435b-d0d0-4fb7-ac3b-73c18e21fd50.png";
    if (isJakobTamboTrail) return "/lovable-uploads/1f998a53-3c5b-429f-8ea5-709a0af96d94.png";
    if (isJakobRefugioTrail) return "/lovable-uploads/8f08a419-86bc-49e3-8707-015d86806c3e.png";
    if (isRefugioCerroLopez) return "/lovable-uploads/18aa5c8f-d10c-4295-a1d7-665ad54ba5c5.png";
    return "/placeholder.svg";
  };
  
  return (
    <>
      <Card 
        className="group hover:shadow-lg transition-all duration-300 animate-fadeIn cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative overflow-hidden rounded-t-lg h-48">
          <img
            src={trail.imageUrl || getDefaultImage()}
            alt={trail.name}
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getDefaultImage();
            }}
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <ReservationBadge requiresReservation={trail.requiresReservation} />
          </div>
          {transportIcons && transportIcons.length > 0 && (
            <div className="absolute bottom-4 right-4 flex gap-2 bg-white/80 rounded-full px-3 py-1">
              {transportIcons.map((icon, index) => (
                <div key={index} className="text-blue-500">
                  {icon}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-semibold">{trail.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 flex-shrink-0" /> {trail.startingPoint}
              </CardDescription>
            </div>
            <DifficultyBadge difficulty={trail.difficulty} />
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-4">
            <TrailStats trail={trail} />
          </div>
          
          <TrailDescription trail={trail} truncate />
          
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">{t('howToGetThere')}</h4>
            <TransportationInfo trail={trail} compact />
            
            {/* Reservation link for Refugio San Martin Jakob */}
            {isJakobRefugioTrail && !shouldExcludeReservationButton && (
              <div className="mt-4">
                <Button
                  variant="region"
                  className="flex items-center gap-2 uppercase"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card click
                    window.open('https://refugiojakob.com.ar/reservas/', '_blank', 'noopener,noreferrer');
                  }}
                >
                  {t('reservationLink')}
                  <ExternalLink size={16} />
                </Button>
              </div>
            )}
            
            {/* Reservation link for Refugio Frey */}
            {isRefugioFreyTrail && !shouldExcludeReservationButton && (
              <div className="mt-4">
                <Button
                  variant="region"
                  className="flex items-center gap-2 uppercase"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card click
                    window.open('https://refugiofreybariloche.com/reservas/', '_blank', 'noopener,noreferrer');
                  }}
                >
                  {t('reservationLink')}
                  <ExternalLink size={16} />
                </Button>
              </div>
            )}
            
            {/* Reservation link (WhatsApp) for Refugio Cerro López */}
            {isRefugioCerroLopez && !shouldExcludeReservationButton && (
              <div className="mt-4">
                <Button
                  variant="region"
                  className="flex items-center gap-2 uppercase"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card click
                    window.open('https://api.whatsapp.com/send?phone=542944341194', '_blank', 'noopener,noreferrer');
                  }}
                >
                  {t('reservationLinkWhatsapp')}
                  <ExternalLink size={16} />
                </Button>
              </div>
            )}
            
            {/* Reservation link (WhatsApp) for Refugio Otto Meiling */}
            {isRefugioOttoMeiling && !shouldExcludeReservationButton && (
              <div className="mt-4">
                <Button
                  variant="region"
                  className="flex items-center gap-2 uppercase"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card click
                    window.open('https://api.whatsapp.com/send?phone=5492944213932&text=Contacto%20Web:', '_blank', 'noopener,noreferrer');
                  }}
                >
                  {t('reservationLinkWhatsapp')}
                  <ExternalLink size={16} />
                </Button>
              </div>
            )}
            
            {/* Reservation link for Refugio Laguna Negra */}
            {isRefugioLagunaNegra && !shouldExcludeReservationButton && (
              <div className="mt-4">
                <Button
                  variant="region"
                  className="flex items-center gap-2 uppercase"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card click
                    window.open('https://refugiolagunanegra.com/reservas/', '_blank', 'noopener,noreferrer');
                  }}
                >
                  {t('reservationLink')}
                  <ExternalLink size={16} />
                </Button>
              </div>
            )}
            
            {/* Reservation link for Laguna Ilón */}
            {isLagunaIlonTrail && !shouldExcludeReservationButton && (
              <div className="mt-4">
                <Button
                  variant="region"
                  className="flex items-center gap-2 uppercase"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card click
                    window.open('https://www.refugioilon.com.ar/reservas', '_blank', 'noopener,noreferrer');
                  }}
                >
                  {t('reservationLink')}
                  <ExternalLink size={16} />
                </Button>
              </div>
            )}
            
            {/* Reservation link (WhatsApp) for Refugio Agostino Rocca */}
            {isRefugioAgostinoRocca && !shouldExcludeReservationButton && (
              <div className="mt-4">
                <Button
                  variant="region"
                  className="flex items-center gap-2 uppercase"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the card click
                    window.open('https://api.whatsapp.com/send/?phone=%2B5492944655903&text&type=phone_number&app_absent=0', '_blank', 'noopener,noreferrer');
                  }}
                >
                  {t('reservationLinkWhatsapp')}
                  <ExternalLink size={16} />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <TrailDetailDialog 
        trail={trail} 
        open={isOpen} 
        onOpenChange={setIsOpen} 
      />
    </>
  );
};

export default TrailCard;
