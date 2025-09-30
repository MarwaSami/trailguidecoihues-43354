
import React from 'react';
import { Trail, TrailType } from '../types/trail';
import TrailCard from './TrailCard';

interface TrailGridProps {
  trails: Trail[];
  type: TrailType;
}

const TrailGrid: React.FC<TrailGridProps> = ({ trails, type }) => {
  const filteredTrails = trails.filter(trail => trail.type === type);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTrails.map((trail) => (
        <TrailCard key={trail.id} trail={trail} />
      ))}
    </div>
  );
};

export default TrailGrid;
