// Base URL of the TripTailor backend.
// Set EXPO_PUBLIC_API_URL in a local .env file (see .env.example).
// On a physical device use your computer's LAN IP instead of localhost.
export const API_URL: string =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000';
