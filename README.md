# Peaceflow

An Expo / React Native application for iOS and Android, with a browser preview. No account, backend, advertising SDK, analytics SDK, or cloud sync.

## Run the browser preview

```sh
npm ci
npm run web
```

Open http://localhost:8081. The browser preview uses **unencrypted localStorage**. Use sample information only. Native storage has a separate implementation.

## Run on a phone or simulator

```sh
npm run ios
# or
npm run android
```

iOS requires a compatible full Xcode installation; Android requires Android Studio, its SDK and a compatible JDK. The first run generates the native projects and builds the app. For subsequent sessions, `npm start` starts Metro for the installed development build.

**Use a development build, not Expo Go.** SQLCipher encryption requires native configuration that Expo Go does not include. The app refuses native writes if encryption is unavailable. Generated `ios/` and `android/` folders are ignored; native configuration lives in `app.json` and `plugins/withPrivateStorage.js`.

## Features

- **Cycle:** date-picker entry, flow and symptoms, history editing/deletion, monthly calendar, and estimates after at least three recorded start dates. The median of up to six recent intervals determines the next estimated date; minimum and maximum observed intervals form a history-based window. Widely spaced or very short recorded intervals suppress estimates instead of being silently ignored. Estimates never roll forward automatically. No fertility or ovulation predictions.
- **Learn:** 50 original posts across ten topics. Continuous virtualized scrolling, filtering, locally saved posts, and links to original sources. After the available collection, posts repeat with a “Revisit” label. These are designed educational cards, not video clips. Long cards expand so content remains readable.
- **Journal:** create, edit and delete dated reflections with optional titles and moods. Entries save explicitly; leaving an unsaved draft asks before discarding it.
- **World:** five curated, researched profiles with full-story source links. Decorative initials are intentionally not presented as portraits.
- **Navigation:** five labeled bottom destinations and a hamburger menu with saved learning, privacy/data controls and help.

## Local privacy

Native builds store personal records in a SQLCipher database in `Documents/peaceflow-private`. A random 256-bit key is stored using Expo SecureStore; iOS uses `WHEN_UNLOCKED_THIS_DEVICE_ONLY`. Database writes are transactional single-statement upserts. SQLCipher availability is checked at startup, and malformed saved data is never silently reset. Saving failures retain the current draft.

The config plugin marks the iOS private directory as excluded from backups. Android disables backup and explicitly excludes cloud-backup and device-transfer domains. Verify these behaviors on real devices before distribution. There is no recovery account or export facility. Device loss or app removal can mean permanent data loss. “Delete all data” clears app records and bookmarks; it is not a promise of forensic storage erasure.

External source links open only when tapped. No personal record is put in a source URL. Static educational text and profiles work offline. The background privacy screen is a best-effort UI cover, not an app lock or screenshot-prevention mechanism.

## Checks

```sh
npm run typecheck
npm test
npx playwright install chromium --no-shell
# Start npm run web in another terminal, then:
npm run test:browser
npm run build:web
npx expo prebuild --no-install
```

Browser tests cover logging three periods and calculating an estimate, overlap rejection, journal creation/editing/persistence, bookmarks, profile opening and complete data deletion. Screenshots are written to `test-results/`. Unit tests cover dates, leap years, insufficient history, irregular records, stale estimates, malformed data and content integrity.

The browser workflows and build are verified locally. Native prebuild is verified; native compilation and real-device storage behavior are **not yet verified** because this machine does not have full Xcode or an Android SDK configured.

## Content and release notes

Every health post links to its source in the app (NHS, WHO, CDC or FDA), except the five original journal prompts. Profiles link to Nobel Prize or NASA. Source links and original summaries are in `src/content.ts`; facts were researched on September 30, 2026. Educational content still needs independent clinical review before a public health-app release.

The original logo screenshot is no longer available at its temporary attachment path. The app uses a pink Peaceflow wordmark; supply the original artwork before final app icons and store assets are prepared. There are no synthetic endorsements, public profiles, user-posted stories or stock photos attributed to the featured women.

Notifications, biometric app lock, dark appearance, manual transfer/export, translations and store submission are outside this implemented slice. Confirm launch regions and minimum age before distribution.

The `xcode` tool's transitive `uuid` dependency is overridden to a patched CommonJS-compatible version. Native prebuild should be rerun whenever this override changes.
