const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: () => ({
      get: mockGet,
      post: mockPost,
      put: mockPut,
      interceptors: { request: { use: jest.fn() } },
    }),
    isAxiosError: (error: any) => Boolean(error && error.isAxiosError),
  },
}));

import {
  generateItinerary,
  getApiErrorMessage,
  getCities,
  getRandomCities,
  signIn,
  signUp,
} from '../services/api';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('auth requests', () => {
  it('signIn posts credentials and returns the token and name', async () => {
    mockPost.mockResolvedValue({ data: { token: 't', fullName: 'Qamar' } });

    const result = await signIn('a@b.com', 'secret1');

    expect(mockPost).toHaveBeenCalledWith('/api/signin', { email: 'a@b.com', password: 'secret1' });
    expect(result).toEqual({ token: 't', fullName: 'Qamar' });
  });

  it('signUp posts the full payload', async () => {
    const payload = {
      fullName: 'Qamar',
      email: 'a@b.com',
      phoneNumber: '0712',
      password: 'secret1',
    };
    mockPost.mockResolvedValue({ data: { token: 't', fullName: 'Qamar' } });

    await signUp(payload);

    expect(mockPost).toHaveBeenCalledWith('/api/signup', payload);
  });
});

describe('city requests', () => {
  it('getCities returns the list from the API', async () => {
    mockGet.mockResolvedValue({ data: [{ _id: '1', name: 'Paris', imageUrl: 'x' }] });

    expect(await getCities()).toEqual([{ _id: '1', name: 'Paris', imageUrl: 'x' }]);
    expect(mockGet).toHaveBeenCalledWith('/api/cities');
  });

  it('getRandomCities uses the random endpoint', async () => {
    mockGet.mockResolvedValue({ data: [] });

    await getRandomCities();

    expect(mockGet).toHaveBeenCalledWith('/api/formcities/random');
  });
});

describe('generateItinerary', () => {
  it('returns only the itinerary text', async () => {
    mockPost.mockResolvedValue({ data: { itinerary: 'Day 1: ...' } });

    const text = await generateItinerary({
      destination: 'Paris',
      fromDate: '2026-01-01',
      toDate: '2026-01-03',
      companion: 'Solo',
      interests: ['Food'],
      budget: 'medium',
    });

    expect(text).toBe('Day 1: ...');
    expect(mockPost.mock.calls[0][0]).toBe('/api/generate-itinerary');
  });
});

describe('getApiErrorMessage', () => {
  it('uses the message sent by the server', () => {
    const error = { isAxiosError: true, response: { data: { message: 'Invalid credentials' } } };
    expect(getApiErrorMessage(error)).toBe('Invalid credentials');
  });

  it('falls back for unknown errors', () => {
    expect(getApiErrorMessage(new Error('boom'))).toBe('An error occurred. Please try again.');
    expect(getApiErrorMessage(new Error('boom'), 'Custom')).toBe('Custom');
  });
});
