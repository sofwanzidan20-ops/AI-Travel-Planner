
export interface Activity {
  name: string;
  description: string;
  hours: string;
  cost: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: Activity[];
}