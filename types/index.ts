export interface Activity {
  activity: string;
  description: string;
  imageUrl: string;
  ticketPrice: number;
  distanceToNextActivity: number;
  bestTravelOption?: string;
}

export interface DayPlan {
  day: number;
  'day-description': string;
  activities: Activity[];
}

export interface City {
  _id: string;
  name: string;
  imageUrl: string;
  description?: string;
  plan?: DayPlan[];
}

export interface User {
  fullName: string;
  email?: string;
  phoneNumber: string;
  profileImage?: string;
}

export interface AuthResponse {
  token: string;
  fullName: string;
}

export interface SignUpPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface ItineraryRequest {
  destination: string;
  fromDate: string;
  toDate: string;
  companion: string;
  interests: string[];
  budget: string;
}

export interface ItineraryData {
  destination: string;
  fromDate: string;
  toDate: string;
  companion: string;
  interests: string[];
  itinerary: string;
}
