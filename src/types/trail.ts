export type TrailType = "day-hike" | "multi-day";
export type Difficulty = "easy" | "moderate" | "hard" | "expert";
export type TransportationType = "bus" | "taxi" | "hitchhiking" | "private-transfer" | "walking";
export type TravelTimeCategory = "direct-access" | "easy-access" | "medium-access";
export type TrailCategory = 'high-mountain' | 'easy-mountain' | 'walking-path' | 'beaches-lakes' | 'nearby';
export type TrailRegion = "pampa-linda" | "bariloche" | "llao-llao";

export interface Trail {
  id: string;
  name: string;
  type: TrailType;
  difficulty: Difficulty;
  distance: number;
  duration: number;
  elevation: number;
  elevationGain?: number; // Adding the new property as optional to maintain compatibility
  requiresReservation: boolean;
  description: {
    en: string;
    es: string;
  };
  imageUrl: string;
  startingPoint: string;
  highlights: string[];
  transportation: TransportationType[];
  distanceFromCampsite: number;
  travelTime: number;
  busLines?: string;
  category?: TrailCategory;
  region?: TrailRegion;
}
