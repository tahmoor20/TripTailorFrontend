import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/config';
import type {
  AuthResponse,
  City,
  ItineraryRequest,
  SignUpPayload,
  User,
} from '../types';

const client = axios.create({ baseURL: API_URL, timeout: 15000 });

// Attach the saved JWT (if any) to every request.
client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Extract a readable message from an API error. */
export function getApiErrorMessage(
  error: unknown,
  fallback = 'An error occurred. Please try again.'
): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string' && message.length > 0) {
      return message;
    }
  }
  return fallback;
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>('/api/signin', { email, password });
  return data;
}

export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>('/api/signup', payload);
  return data;
}

export async function getUser(): Promise<User> {
  const { data } = await client.get<User>('/api/user');
  return data;
}

export async function updateUser(formData: FormData): Promise<User> {
  const { data } = await client.put<User>('/api/user', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getCities(): Promise<City[]> {
  const { data } = await client.get<City[]>('/api/cities');
  return data;
}

export async function getRandomCities(): Promise<City[]> {
  const { data } = await client.get<City[]>('/api/formcities/random');
  return data;
}

export async function generateItinerary(request: ItineraryRequest): Promise<string> {
  // Itinerary generation calls an LLM, so allow a longer timeout.
  const { data } = await client.post<{ itinerary: string }>(
    '/api/generate-itinerary',
    request,
    { timeout: 60000 }
  );
  return data.itinerary;
}
