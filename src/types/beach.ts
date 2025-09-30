
export type BeachType = "sandy" | "rocky" | "mixed" | "pebbly";
export type Activity = "swimming" | "kayaking" | "fishing" | "picnic" | "viewpoint" | "sunbathing";
export type Facility = "parkingAvailable" | "restrooms" | "foodVendors";
export type TrailRegion = "bariloche" | "pampLinda" | "";

export interface Beach {
  id: string;
  name: string;
  location: string;
  description: {
    en: string;
    es: string;
  };
  imageUrl: string;
  beachType: BeachType;
  waterTemp: {
    summer: number;  // Temperature in Celsius
    winter: number;
  };
  activities: Activity[];
  facilities: Facility[];
  distanceFromCampsite: number;
  travelTime: number;
  transportation: string[];
  bestTimeToVisit: string;
}
