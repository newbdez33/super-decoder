# Super Decoder Roadmap

## Completed

- [x] Core game logic (seeded RNG, hint engine, level generator)
- [x] 600 levels with progressive difficulty curve
- [x] Solo, Duo, and Free Play modes
- [x] 3 themes (LED Classic, Modern Flat, Cyberpunk)
- [x] Color blind mode (symbol overlays on slots and picker)
- [x] Color blind mode for hint dots (symbols on direct/indirect feedback)
- [x] Web PWA (React 19 + Vite + Framer Motion)
- [x] Mobile app (Expo SDK 52 + React Native)
- [x] Zustand stores with platform-specific persistence
- [x] 181 unit/component tests (Vitest)
- [x] Playwright E2E tests (iPhone 14, Pixel 7, iPad Mini)
- [x] 22 Maestro E2E flows (mobile, including colorblind hints)
- [x] Star rating system (1-3 stars based on guesses used)

## In Progress

- [ ] Color blind hint dot symbols — manual QA on both platforms

## Sound Effects

- [ ] Sound engine abstraction (Howler.js on web, expo-av on mobile)
- [ ] Slot placement sound (color placed into a slot)
- [ ] Guess submission sound
- [ ] Correct guess / victory fanfare
- [ ] Incorrect guess / failure sound
- [ ] Star award chime (per star)
- [ ] Button tap / UI interaction sounds
- [ ] Volume control in settings
- [ ] Mute toggle in settings (persisted)
- [ ] Respect device silent mode on mobile

## Polish

- [ ] Haptic feedback patterns (differentiate success/failure/tap)
- [ ] Animated transitions between screens (mobile)
- [ ] Onboarding tutorial for first-time players
- [ ] Localization (i18n) — English, Chinese

## iOS App Store Launch

### Account & Config
- [ ] Enroll in Apple Developer Program ($99/yr)
- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Run `eas build:configure` in `apps/mobile/` to generate `eas.json`
- [ ] Confirm bundle ID `com.superdecoder.app` is available

### Assets
- [ ] Verify `icon.png` is 1024x1024
- [ ] Prepare App Store screenshots (6.7" iPhone + 12.9" iPad)
- [ ] Write app description (short + full)
- [ ] Prepare privacy policy URL (required even for offline games)

### Build & Test
- [ ] `eas build --platform ios --profile production`
- [ ] Test on real device via TestFlight

### Submit
- [ ] Create app in App Store Connect
- [ ] `eas submit --platform ios` to upload build
- [ ] Fill in metadata, screenshots, privacy policy, age rating
- [ ] Submit for App Review (typically 24-48 hours)

## Planned

### Google Play Store Launch
- [ ] Register Google Play Developer account ($25 one-time)
- [ ] Add Android adaptive icon foreground image
- [ ] `eas build --platform android --profile production`
- [ ] Create app in Google Play Console
- [ ] Complete content rating + data safety forms
- [ ] 20 testers x 14 days closed testing (Google requirement for new apps)
- [ ] Production release

### Gameplay
- [ ] Undo last color placement
- [ ] Hint history / scroll back through previous guesses on small screens
- [ ] Level select screen (replay completed levels)
- [ ] Daily challenge mode (shared seed based on date)

### Infrastructure
- [ ] CI: automated Vitest + Playwright on PR
- [ ] CI: automated Maestro E2E on push to develop/main
- [ ] Web deployment pipeline (Vercel/Netlify)
- [ ] Analytics (anonymous gameplay stats)
