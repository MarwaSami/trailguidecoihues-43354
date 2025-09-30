
import React from 'react';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../context/LanguageContext';

interface ReservationBadgeProps {
  requiresReservation: boolean;
}

const ReservationBadge: React.FC<ReservationBadgeProps> = ({ 
  requiresReservation 
}) => {
  const { t } = useLanguage();

  return (
    <Badge 
      variant={requiresReservation ? "destructive" : "secondary"}
      className="backdrop-blur-sm bg-opacity-90"
    >
      {requiresReservation ? t('reservationRequired') : t('noReservation')}
    </Badge>
  );
};

export default ReservationBadge;
