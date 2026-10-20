# TripTailor Frontend

Mobile app for **TripTailor**, a travel-planning app that lets users browse cities and request a personalised itinerary based on destination, dates, travel companions and interests. Built with React Native (Expo) and TypeScript.

> Backend repo: [triptailorBackend](https://github.com/tahmoor20/triptailorBackend)

## Features

- Sign up and sign in
- Browse popular cities on the home tab
- Explore tab: fill in destination, dates, companion and interests, then request a generated itinerary from the backend (`/api/generate-itinerary`)
- Itinerary screen showing the generated travel plan
- Profile and account settings (view and update user details)

## Tech stack

- React Native, Expo SDK 52, Expo Router (file-based navigation)
- TypeScript
- Axios for API calls
- React Native Paper, React Navigation
- AsyncStorage for the auth token
- Jest (`jest-expo` preset)

## Project structure

```
.
├── app/
│   ├── _layout.tsx          # Root layout
│   ├── SignIn.tsx           # Sign-in screen
│   ├── SignUp.tsx           # Sign-up screen
│   └── (tabs)/
│       ├── index.tsx        # Home: list of cities
│       ├── explore.tsx      # Itinerary request form
│       ├── itinerary.tsx    # Generated itinerary
│       ├── profile.tsx      # User profile
│       ├── accountSettings.tsx
│       └── homecitydetails.tsx
├── assets/                  # Images and fonts
├── app.json                 # Expo config
└── package.json
```

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the backend (see the backend repo) so the app can reach `http://localhost:5000`.

3. Start the app:

   ```bash
   npx expo start
   ```

   Then press `a` for Android, `i` for iOS, or `w` for web, or scan the QR code with Expo Go.

> The API base URL is currently set to `http://localhost:5000` in the screens. When running on a physical device, replace it with your computer's local IP address.

## Author

Qamar Uddin - [LinkedIn](https://linkedin.com/in/its-qamar-uddin) · [GitHub](https://github.com/tahmoor20)
