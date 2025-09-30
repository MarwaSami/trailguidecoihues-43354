
import React from 'react';
import { Bus, Car, ThumbsUp, Users, FootprintsIcon, Map } from 'lucide-react';

export const getTransportIcon = (type: string) => {
  switch(type) {
    case 'bus':
      return <Bus className="w-4 h-4" />;
    case 'taxi':
      return <Car className="w-4 h-4" />;
    case 'hitchhiking':
      return <ThumbsUp className="w-4 h-4" />;
    case 'private-transfer':
      return <Users className="w-4 h-4" />;
    case 'walking':
      return <FootprintsIcon className="w-4 h-4" />;
    default:
      return <Map className="w-4 h-4" />;
  }
};
