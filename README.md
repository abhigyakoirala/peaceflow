# Peaceflow

An Expo / React Native application for iOS and Android, with a browser preview. No account, backend, advertising SDK, analytics SDK, or cloud sync.

## Run the browser preview

```sh
npm ci
npm run web
```

Open http://localhost:8081. The browser preview uses **unencrypted localStorage**. Use sample information only. Native storage has a separate implementation.

## Install Peaceflow on your iPhone

**Install a custom Peaceflow build, not Expo Go.** This project uses SQLCipher, which needs native configuration. Expo Go cannot run its encrypted storage. There is no App Store download or prebuilt iPhone installer in this repository yet.

Choose one route:

| Route | What you need | Best for |
| --- | --- | --- |
| A: build on your Mac | Mac, full Xcode, iPhone, cable, Apple Account | Personal testing; a free Personal Team can be used |
| B: Expo cloud build | Computer, Expo account, paid Apple Developer membership, registered iPhone | Installing through a build link; no local Xcode required |

These accounts are developer tools only. Peaceflow itself has no user account. Apple permits personal-device testing with a free account, but its Personal Team provisioning expires after seven days, requiring another build/install. See [Apple’s membership comparison](https://developer.apple.com/support/compare-memberships/).

### A. Build and install from a Mac

#### 1. Prepare the Mac

1. Install **full Xcode** from the Mac App Store. Command Line Tools alone are insufficient. Use an Xcode version compatible with this project's Expo SDK 57 and your iPhone's iOS version.
2. Open Xcode once, accept its license, and install its requested iOS components. Make room on your disk for Xcode, dependencies and build output.
3. Install **Node.js 24** from [nodejs.org](https://nodejs.org/) if necessary; this project was developed with Node 24. Verify in Terminal:

   ```sh
   node --version
   npm --version
   ```

4. Point the command-line tools at full Xcode (adjust the path if your installation has a different name):

   ```sh
   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
   sudo xcodebuild -runFirstLaunch
   xcodebuild -version
   ```

5. Install CocoaPods if `pod --version` does not work. If you use [Homebrew](https://brew.sh/), run:

   ```sh
   brew install cocoapods
   pod --version
   ```

#### 2. Download this project

In Terminal:

```sh
git clone https://github.com/abhigyakoirala/peaceflow.git
cd peaceflow
npm ci
```

If you already have this folder, open Terminal there and use `git pull --ff-only` followed by `npm ci` instead. Keep your own changes committed before pulling.

#### 3. Connect and prepare your iPhone

1. Connect the unlocked iPhone to the Mac with a data-capable cable. Accept **Trust This Computer** on the phone and any pairing prompt on the Mac.
2. In Xcode, open **Settings → Apple Accounts** (called **Accounts** in some versions), sign in, and select your Personal Team or developer team.
3. Open **Window → Devices and Simulators** in Xcode and wait for the phone to finish pairing/preparing. Apple describes this process in [running on a physical device](https://developer.apple.com/documentation/xcode/running-your-app-on-simulated-or-physical-devices).
4. On iOS 16 or later, enable **Settings → Privacy & Security → Developer Mode**. Restart the phone and confirm **Turn On** when prompted. If the setting is missing, finish Xcode pairing or attempt the first installation, then check again. See [Expo’s Developer Mode guide](https://docs.expo.dev/guides/ios-developer-mode/).

#### 4. Build and install

From the `peaceflow` folder:

```sh
npm run ios -- --device
```

Select your physical iPhone when prompted. Expo generates `ios/`, installs native dependencies, builds the app and attempts to launch it. Allow the first build time to finish. `npm run ios` without `--device` is generally for a simulator; a simulator build cannot be installed on an iPhone. The command options are documented in [Expo CLI](https://docs.expo.dev/more/expo-cli/).

**If signing fails:**

1. If the native project has not been generated, run `npx expo prebuild --platform ios`.
2. Open `ios/Peaceflow.xcworkspace` in Xcode, **not** the `.xcodeproj` file.
3. Select the **Peaceflow** project, then its app target, then **Signing & Capabilities**. Enable **Automatically manage signing** and choose your team.
4. If `app.peaceflow.mobile` cannot be registered to your team, change `expo.ios.bundleIdentifier` in `app.json` to an identifier you control, such as `com.yourname.peaceflow`. Regenerate with `npx expo prebuild --platform ios`, reopen the workspace and select your team again. Choose the identifier before entering real records; changing it creates a separate app.
5. Choose the connected iPhone as the run destination and press **Run ▶** in Xcode, or retry `npm run ios -- --device`.

These signing steps follow [Expo’s Xcode signing guide](https://github.com/expo/fyi/blob/main/setup-xcode-signing.md). Generated native directories are ignored by Git; preserve durable settings in `app.json` and the config plugins. Local Xcode-only settings may need to be reapplied after regeneration.

If iOS shows **Untrusted Developer**, open **Settings → General → VPN & Device Management**, select your developer identity and trust it, then reopen Peaceflow.

#### 5. Open the development app

The installation command normally starts Metro, the development server. If it is not running, start it in the project folder:

```sh
npm start -- --lan
```

Keep Terminal running. Put the Mac and iPhone on the same Wi-Fi network and allow Peaceflow's Local Network permission if requested. Open the installed **Peaceflow** app and select the server, or scan Metro's QR code using the iPhone Camera. Open the link in the Peaceflow development build, not Expo Go. `localhost:8081` on the phone refers to the phone, not your Mac.

If the network blocks device-to-computer connections, try:

```sh
npm start -- --tunnel
```

Accept the tunnel dependency prompt if needed. A tunnel uses an external service to serve the development bundle; it does not add record sync to Peaceflow. LAN is preferable when available. See [Expo’s development connection guidance](https://docs.expo.dev/get-started/start-developing/).

#### 6. Install a build that runs without your Mac

For a self-contained local Release build with JavaScript bundled inside:

```sh
npm run ios -- --device --configuration Release
```

Select the iPhone again. After a successful installation, open Peaceflow from its icon without Metro. This is still a personally signed installation, not an App Store release, and your provisioning expiry still applies. The command is supported by [Expo CLI’s local build options](https://docs.expo.dev/more/expo-cli/).

#### 7. Verify and update

Use sample entries first. Save a period and journal entry, close/reopen the app and check they remain. In a Release build, also test in airplane mode; bundled posts, journaling and tracking should work, while external source links need internet.

For updates:

```sh
git pull --ff-only
npm ci
npm run ios -- --device
```

Use the Release command instead for a standalone installation. JavaScript-only development changes can reload through Metro; native dependency or plugin changes require rebuilding. Do not uninstall the app just to update it: personal records have no cloud backup, and uninstalling can delete them.

### B. Build in Expo's cloud

This route requires an Expo account and a **paid Apple Developer membership**. It uploads project source for building; it does not upload records entered in the installed app. No EAS project is linked yet. Clone the repository, run `npm ci`, then:

```sh
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest device:create
```

Choose iOS, link/create your Expo project, and register the actual iPhone using the supplied URL and device-registration prompts. Complete Apple authentication through the CLI. See [Expo’s device-build walkthrough](https://docs.expo.dev/tutorial/eas/ios-development-build-for-devices/).

The repository includes these `eas.json` profiles:

- **development:** custom development client; connect it to `npm start -- --lan` afterward.
- **preview:** self-contained internal build; no Metro server needed after installation.

For a standalone install:

```sh
npx eas-cli@latest build --platform ios --profile preview
```

Select your team, allow the CLI to manage signing credentials if appropriate, and include your registered iPhone. After the build completes, open its installation link in Safari on that iPhone and tap **Install**. Only devices included in its provisioning profile can install it. Registering another phone requires a new or re-signed build. See [Expo’s internal distribution guide](https://docs.expo.dev/build/internal-distribution/).

For development instead, use:

```sh
npx eas-cli@latest build --platform ios --profile development
```

Install from the returned link, enable Developer Mode if prompted, and connect to Metro as described above. Build quotas, signing and account requirements are governed by Expo and Apple. No cloud build or store submission has been started for this repository.

### iPhone troubleshooting

| Problem | What to check |
| --- | --- |
| `xcodebuild requires Xcode` | Install full Xcode and run the `xcode-select --switch` command above. |
| iPhone missing from device selection | Unlock it, check the data cable, trust the Mac and finish Xcode pairing. Update Xcode if the phone's iOS is unsupported. |
| Missing development team or provisioning profile | Select your Apple Account/team and automatic signing in Xcode; ensure the bundle identifier belongs to your team. |
| App stops opening after about a week | Free Personal Team provisioning may have expired. Rebuild/install with the same identifier; avoid uninstalling first. |
| Cannot connect to Metro | Keep the server running, use the same Wi-Fi, permit Local Network access, check firewall/VPN settings or try the tunnel option. |
| Encrypted-storage / Expo Go error | Open the custom Peaceflow build. Rebuild after native/plugin changes. Expo Go does not include this SQLCipher configuration. |
| CocoaPods missing | Install CocoaPods, check `pod --version`, and retry the build. |
| Build fails with `ENOSPC` | Free disk space on the Mac, then retry; Xcode and native builds need substantial storage. |

Native compilation, installation and backup exclusions still need verification on a real iPhone. These instructions do not imply that a signed installer has already been produced.

## Run on Android or an iOS simulator

```sh
npm run android
# On a Mac with full Xcode, for an iOS simulator:
npm run ios
```

Android requires Android Studio, its SDK and a compatible JDK. Both platforms require a custom build for SQLCipher. Native configuration lives in `app.json` and `plugins/withPrivateStorage.js`.

## Features

- **Cycle:** date-picker entry, flow and symptoms, history editing/deletion, monthly calendar, and estimates after at least three recorded start dates. The median of up to six recent intervals determines the next estimated date; minimum and maximum observed intervals form a history-based window. Widely spaced or very short recorded intervals suppress estimates instead of being silently ignored. Estimates never roll forward automatically. No fertility or ovulation predictions.
- **Learn:** 50 original posts across ten topics. Each card fills the space between the topic filters and bottom navigation; swipe vertically to snap to the next lesson, or tap the next-lesson arrow. Filtering, locally saved posts, and original source links are included. After the available collection, posts repeat with a “Revisit” label. These are designed educational cards, not video clips. On small screens or with large text, long content scrolls inside the card while the next-lesson and save controls remain available.
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
