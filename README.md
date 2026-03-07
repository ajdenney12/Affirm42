# NextSelf - React Native Mobile App

A personal wellness and affirmations mobile app built with React Native and Expo.

## Features

- User authentication (sign up, login, password reset)
- Daily affirmations tracking
- Goal setting and progress tracking
- AI wellness coach chat
- Secure data storage with Supabase
- Beautiful gradient UI design

## Tech Stack

- **React Native** with Expo
- **Expo Router** for navigation
- **Supabase** for backend (auth, database)
- **TypeScript** for type safety
- **Expo Linear Gradient** for beautiful UI

## Prerequisites

- Node.js 18+ installed
- Expo CLI installed globally: `npm install -g expo-cli`
- EAS CLI for building: `npm install -g eas-cli`
- An Expo account (free tier works)
- A Supabase project with the required database tables

## Database Setup

Make sure your Supabase project has these tables:

### affirmations
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `text` (text)
- `timestamp` (timestamp)

### goals
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `title` (text)
- `description` (text)
- `type` (text)
- `current` (integer)
- `target` (integer)
- `status` (text)
- `created_at` (timestamp)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Update the Supabase credentials in `lib/supabase.ts` or use environment variables in `app.json`:
```json
"extra": {
  "supabaseUrl": "your-supabase-url",
  "supabaseAnonKey": "your-supabase-anon-key"
}
```

## Development

Start the development server:
```bash
npm start
```

Run on iOS simulator:
```bash
npm run ios
```

Run on Android emulator:
```bash
npm run android
```

## Building for Production

### First Time Setup

1. Login to EAS:
```bash
eas login
```

2. Configure your project:
```bash
eas build:configure
```

### Building for iOS

1. Build for iOS:
```bash
npm run build:ios
```

2. Once built, download the IPA file or submit to App Store:
```bash
npm run submit:ios
```

### Building for Android

1. Build for Android:
```bash
npm run build:android
```

2. Once built, download the APK/AAB or submit to Play Store:
```bash
npm run submit:android
```

## App Store Submission Checklist

### iOS (Apple App Store)

1. **Apple Developer Account**
   - Enroll in Apple Developer Program ($99/year)
   - Create App ID in Apple Developer portal
   - Create App Store Connect listing

2. **App Information**
   - App name: NextSelf
   - Bundle ID: com.nextwellai.nextself
   - Primary category: Health & Fitness
   - Age rating: 13+

3. **Required Assets**
   - App icon (1024x1024px)
   - Screenshots for all required device sizes
   - App preview video (optional but recommended)

4. **Privacy & Permissions**
   - Privacy policy URL
   - Data collection disclosure
   - Terms of service

5. **Build & Submit**
   - Update `eas.json` with your Apple IDs
   - Run `npm run build:ios`
   - Run `npm run submit:ios`
   - Wait for review (typically 1-3 days)

### Android (Google Play Store)

1. **Google Play Console Account**
   - One-time $25 registration fee
   - Create new app in Play Console

2. **App Information**
   - App name: NextSelf
   - Package name: com.nextwellai.nextself
   - Category: Health & Fitness
   - Content rating: Everyone

3. **Required Assets**
   - App icon (512x512px)
   - Feature graphic (1024x500px)
   - Screenshots (at least 2)
   - Privacy policy URL

4. **Build & Submit**
   - Generate upload keystore
   - Update `eas.json` with service account
   - Run `npm run build:android`
   - Upload to Play Console
   - Submit for review

## Project Structure

```
/app
  /(auth)
    /login.tsx          # Authentication screen
  /(tabs)
    /_layout.tsx        # Tab navigation layout
    /index.tsx          # Affirmations screen
    /goals.tsx          # Goals tracking screen
    /chat.tsx           # AI coach chat screen
  /_layout.tsx          # Root layout
  /index.tsx            # App entry point
/lib
  /supabase.ts          # Supabase client setup
/assets                 # App icons and images
```

## Environment Variables

The app uses these Supabase credentials (update in production):
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon/public key

## Support

For issues or questions, contact: ajdenney12@gmail.com

## License

Proprietary - NextWell AI
