# TripTailor Frontend

Mobile app for **TripTailor**, a travel-planning app that lets users browse cities and request a personalised itinerary based on destination, dates, travel companions and interests. Built with React Native (Expo) and TypeScript.

> Backend repo: [triptailorBackend](https://github.com/tahmoor20/triptailorBackend)

## Features

- Sign up and sign in (JWT stored with AsyncStorage)
- Browse popular cities on the home tab, each with a 3-day plan
- Explore tab: pick a destination, dates, companion and interests, then request an AI-generated itinerary from the backend
- Itinerary screen showing the generated travel plan
- Profile screen: update name, phone number and profile picture
- Account settings and log out

## Tech stack

- React Native, Expo SDK 52, Expo Router (file-based navigation)
- TypeScript
- Axios (one shared client in `services/api.ts`)
- React Native Paper, React Navigation
- AsyncStorage for the auth token
- Jest (`jest-expo`) and GitHub Actions CI (type-check and tests)

## Getting started

1. Start the backend first (see its README) so the app has an API to talk to.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file from the example and set the backend URL:

   ```bash
   cp .env.example .env
   ```

   ```
   EXPO_PUBLIC_API_URL=http://localhost:5000
   ```

   On a physical device, use your computer's local network IP instead of `localhost`.

4. Start the app:

   ```bash
   npx expo start
   ```

   Press `a` for Android, `i` for iOS, `w` for web, or scan the QR code with Expo Go.

## Scripts

| Script              | What it does                    |
| ------------------- | ------------------------------- |
| `npm start`         | Start the Expo dev server       |
| `npm test`          | Run Jest in watch mode          |
| `npm run typecheck` | Type-check with TypeScript      |

## Project structure

```
.
├── app/                     # Screens (Expo Router)
│   ├── _layout.tsx
│   ├── SignIn.tsx
│   ├── SignUp.tsx
│   └── (tabs)/              # Home, explore, itinerary, profile, account settings
├── services/api.ts          # Typed API client for the backend
├── types/index.ts           # Shared TypeScript types
├── utils/validation.ts      # Sign-in and sign-up form validation
├── constants/config.ts      # API base URL from EXPO_PUBLIC_API_URL
├── __tests__/               # Unit tests for validation and the API client
└── assets/                  # Images
```

## Author

Qamar Uddin - [LinkedIn](https://linkedin.com/in/its-qamar-uddin) · [GitHub](https://github.com/tahmoor20)
