
import React from 'react';
import { Trail } from '../../types/trail';
import { MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import DifficultyBadge from './DifficultyBadge';
import ReservationBadge from './ReservationBadge';
import TrailStats from './TrailStats';
import TrailDescription from './TrailDescription';
import TransportationInfo from './TransportationInfo';

interface TrailDetailDialogProps {
  trail: Trail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TrailDetailDialog: React.FC<TrailDetailDialogProps> = ({ 
  trail, 
  open, 
  onOpenChange 
}) => {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{trail.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <MapPin className="w-4 h-4" /> {trail.startingPoint}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="mb-6 relative h-60 sm:h-80 overflow-hidden rounded-lg">
            <img 
              src={trail.imageUrl} 
              alt={trail.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <ReservationBadge requiresReservation={trail.requiresReservation} />
            </div>
          </div>
          
          <div className="mb-6">
            <TrailStats trail={trail} size="lg" />
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">{t('difficulty')}</h4>
            <DifficultyBadge difficulty={trail.difficulty} size="md" />
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">{t('description')}</h4>
            <TrailDescription trail={trail} />
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-2">{t('howToGetThere')}</h4>
            <TransportationInfo trail={trail} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrailDetailDialog;
