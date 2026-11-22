# Soulmate AI

An anime-inspired AI character chat app built with Expo and React Native.

## Implemented foundation
- Dark purple visual theme and responsive home screen
- Character discovery categories
- Character chat preview with message composer
- Character creation draft screen
- Chats library and profile screens
- Expo Router navigation

## Run locally
```bash
npm install
npx expo start
```

## Current limitations
The chat currently stores messages only in local screen state and does not generate AI replies. Connect a secure backend/model endpoint before enabling live AI conversations. API secrets must remain on the server, never in the mobile bundle.

Character artwork, persistent accounts/chat storage, moderation, and production build configuration are still to be completed.
