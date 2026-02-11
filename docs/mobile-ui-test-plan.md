# Super Decoder — Mobile UI Test Plan

## 1. Test Strategy

### 1.1 Tool
**Maestro** — shared YAML flows that run on both iOS and Android with no platform-specific branching unless explicitly required.

### 1.2 Environments

| Platform | Device | OS Version | Notes |
|----------|--------|------------|-------|
| Android | Pixel 6 (emulator) | API 34 (Android 14) | Google APIs x86_64 |
| iOS | iPhone 15 (simulator) | iOS 17 | Xcode 15+ on macOS |

### 1.3 Execution Model

| Trigger | Tag | Scope |
|---------|-----|-------|
| Pull request to `develop`/`main` | `smoke` | Fast subset (4 flows, ~2 min) |
| Push to `develop`/`main` | `full` | All flows (~10 min) |
| Manual dispatch | `full` | All flows |

### 1.4 Artifacts
- JUnit XML report (`e2e-results.xml`)
- Screenshots on failure (`~/.maestro/tests/`)
- Named screenshots from `takeScreenshot` steps

### 1.5 App Under Test
- **App ID**: `host.exp.exponent` (Expo Go)
- **Expo SDK**: 52
- **Launch mode**: `npx expo start --android|--ios --no-dev --minify`

---

## 2. Test Matrix

### 2.1 Home Screen

| # | Flow | Priority | File | Status |
|---|------|----------|------|--------|
| 01 | Home screen elements & navigation | P0 | `01-home-screen.yaml` | Existing |

### 2.2 Solo Mode

| # | Flow | Priority | File | Status |
|---|------|----------|------|--------|
| 02 | Win flow — 3-star (1-3 attempts) | P0 | `02-solo-win.yaml` | Existing |
| 03 | Lose + Retry | P0 | `03-solo-lose.yaml` | Existing |
| 14 | Win flow — 2-star (4-5 attempts) | P1 | `14-solo-2star.yaml` | **NEW** |
| 15 | Lose + Skip → next level | P1 | `15-solo-skip.yaml` | **NEW** |

### 2.3 Duo Mode

| # | Flow | Priority | File | Status |
|---|------|----------|------|--------|
| 04 | Direct hints | P0 | `04-duo-mode.yaml` | Existing |
| 16 | Indirect hints + 2x2 grid | P1 | `16-duo-indirect.yaml` | **NEW** |

### 2.4 Free Play

| # | Flow | Priority | File | Status |
|---|------|----------|------|--------|
| 05 | Basic flow | P0 | `05-free-play.yaml` | Existing |

### 2.5 Settings

| # | Flow | Priority | File | Status |
|---|------|----------|------|--------|
| 06 | All toggles & options | P0 | `06-settings.yaml` | Existing |
| 20 | Persistence after restart | P1 | `20-settings-persistence.yaml` | **NEW** |

### 2.6 Stats

| # | Flow | Priority | File | Status |
|---|------|----------|------|--------|
| 07 | Fresh state (zeroes) | P0 | `07-stats.yaml` | Existing |
| 17 | After games played | P1 | `17-stats-after-play.yaml` | **NEW** |

### 2.7 Themes & Accessibility

| # | Flow | Priority | File | Status |
|---|------|----------|------|--------|
| 08 | Switch 3 themes | P0 | `08-theme-switching.yaml` | Existing |
| 09 | Colorblind mode — 4 basic symbols | P0 | `09-colorblind-mode.yaml` | Existing |
| 21 | Colorblind mode — all 8 symbols | P1 | `21-colorblind-all-symbols.yaml` | **NEW** |

### 2.8 Navigation & Edge Cases

| # | Flow | Priority | File | Status |
|---|------|----------|------|--------|
| 10 | All back buttons | P0 | `10-navigation.yaml` | Existing |
| 11 | Leave game confirm alert | P0 | `11-game-alerts.yaml` | Existing |
| 12 | Reset progress | P0 | `12-reset-progress.yaml` | Existing |
| 13 | Incomplete guess, clear, rapid taps | P0 | `13-edge-cases.yaml` | Existing |

### 2.9 Hint Display

| # | Flow | Priority | File | Status |
|---|------|----------|------|--------|
| 18 | All 8 colors in color picker | P1 | `18-all-colors.yaml` | **NEW** |
| 19 | Direct + Indirect hint rendering | P1 | `19-hint-display.yaml` | **NEW** |

### 2.10 Summary

| Status | Count |
|--------|-------|
| Existing | 13 |
| New | 8 |
| **Total** | **21** |

---

## 3. Smoke Test Suite

Smoke tests run on every PR for fast feedback (~2 min).

| # | Flow | Reason |
|---|------|--------|
| 01 | Home screen | Verifies app launches and navigates |
| 02 | Solo win | Core game loop |
| 03 | Solo lose | Failure path |
| 10 | Navigation | All back buttons work |

Tag: `smoke`

---

## 4. New Test Flow Descriptions

### 4.1 Flow 14 — Solo 2-Star Win (`14-solo-2star.yaml`)
**Goal**: Verify 2-star rating displays when solving in 4-5 attempts.
**Steps**:
1. Launch with fresh state (level 1: secret = yellow, blue, red, green)
2. Submit 3 wrong guesses (wrong order)
3. Submit correct guess on attempt 4
4. Verify win modal shows "CODE CRACKED!" and "Solved in 4 / 7 steps"
5. Verify 2-star rating (2 filled, 1 empty)

### 4.2 Flow 15 — Solo Skip (`15-solo-skip.yaml`)
**Goal**: Verify Skip button advances to next level after a loss.
**Steps**:
1. Launch with fresh state
2. Submit 7 wrong guesses to lose
3. Verify lose modal with "CODE INTACT"
4. Tap Skip button
5. Verify level advances to LV.002

### 4.3 Flow 16 — Duo Indirect Hints (`16-duo-indirect.yaml`)
**Goal**: Verify indirect hint mode in Duo with 2x2 dot grid.
**Steps**:
1. Launch with fresh state
2. Navigate to Duo setter screen
3. Select "Indirect" hint mode
4. Set secret code (red, blue, green, yellow)
5. Confirm and enter game
6. Submit a partially correct guess
7. Verify indirect hints container is visible (2x2 grid)
8. Submit correct guess, verify win

### 4.4 Flow 17 — Stats After Play (`17-stats-after-play.yaml`)
**Goal**: Verify stats update after completing a game.
**Steps**:
1. Launch with fresh state
2. Win level 1 (correct guess on attempt 1)
3. Go Home, navigate to Stats
4. Verify Games Played = 1, Games Won = 1, Win Rate = 100%
5. Verify Current Level = 2, Current Streak = 1

### 4.5 Flow 18 — All 8 Colors (`18-all-colors.yaml`)
**Goal**: Verify all 8 colors appear in Duo mode with 8-color count.
**Steps**:
1. Launch with fresh state
2. Navigate to Duo setter screen
3. Select 8 colors
4. Verify all 8 color buttons visible: red, blue, green, yellow, orange, purple, white, pink

### 4.6 Flow 19 — Hint Display Verification (`19-hint-display.yaml`)
**Goal**: Verify both direct and indirect hint rendering after guesses.
**Steps**:
1. Launch with fresh state, enter solo mode (direct hints)
2. Submit a guess, verify direct hints appear (dots with accessibility labels)
3. Go home, enter Duo mode with indirect hints
4. Submit a guess, verify indirect hints container appears

### 4.7 Flow 20 — Settings Persistence (`20-settings-persistence.yaml`)
**Goal**: Verify settings survive app restart.
**Steps**:
1. Launch with fresh state
2. Navigate to Settings
3. Toggle sound OFF, enable colorblind mode, switch to Cyberpunk theme
4. Go Home
5. Relaunch app (without clearing state)
6. Navigate to Settings
7. Verify sound is OFF, colorblind is ON, theme is Cyberpunk

### 4.8 Flow 21 — Colorblind All 8 Symbols (`21-colorblind-all-symbols.yaml`)
**Goal**: Verify all 8 colorblind symbols render in Duo mode with 8 colors.
**Steps**:
1. Launch with fresh state
2. Enable colorblind mode in Settings
3. Navigate to Duo setter screen
4. Select 8 colors
5. Verify all 8 symbols visible: `●` `■` `▲` `◆` `★` `✚` `○` `♥`

---

## 5. testID Requirements

Components that need new testIDs for flow coverage:

### DirectHints.tsx
| testID Pattern | Purpose |
|----------------|---------|
| `direct-hint-{row}-{col}` | Individual hint dot identification |
| Accessibility labels: `correct`, `wrong position`, `not exist` | Already present |

### IndirectHints.tsx
| testID Pattern | Purpose |
|----------------|---------|
| `indirect-hints-{row}` | Indirect hints container per row |
| Accessibility labels: `correct position`, `correct color`, `no match` | Already present |

### StarRating.tsx
| testID Pattern | Purpose |
|----------------|---------|
| `star-rating` | Container for star display |
| `star-{1,2,3}` | Individual star identification |
| Accessibility labels: `earned star`, `empty star` | Already present |

---

## 6. iOS-Specific Considerations

### 6.1 Safe Area Insets
- Verify content doesn't overlap with Dynamic Island / notch
- Bottom safe area for home indicator
- Uses `react-native-safe-area-context` (already configured)

### 6.2 Navigation Gestures
- expo-router supports iOS swipe-back by default
- Verify swipe-back doesn't conflict with game interactions

### 6.3 Font Rendering
- Verify Orbitron and Exo 2 custom fonts load correctly on iOS
- iOS may render slightly differently — visual comparison via screenshots

### 6.4 Haptics
- `expo-haptics` supported on iOS (physical devices only, not simulator)
- Simulator tests skip haptic verification

### 6.5 Keyboard
- iOS keyboard behavior for any text inputs
- Safe area adjustments when keyboard appears

---

## 7. CI Pipeline

### 7.1 Android Job (Existing)
```
Trigger: PR/push to develop/main
Runner: ubuntu-latest
Emulator: Pixel 6, API 34, Google APIs x86_64
Tool: Maestro CLI
Artifacts: JUnit XML, screenshots
```

### 7.2 iOS Job (New)
```
Trigger: PR/push to develop/main
Runner: macos-latest
Simulator: iPhone 15, iOS 17
Tool: Maestro CLI
Artifacts: JUnit XML, screenshots
```

### 7.3 Job Matrix

| Job | Runner | Device | Timeout |
|-----|--------|--------|---------|
| `maestro-android` | `ubuntu-latest` | Pixel 6 API 34 | 30 min |
| `maestro-ios` | `macos-latest` | iPhone 15 iOS 17 | 30 min |

### 7.4 Tag Strategy

| Event | Tag | Flows Run |
|-------|-----|-----------|
| Pull Request | `smoke` | 01, 02, 03, 10 |
| Push to develop/main | `full` | All 21 flows |

---

## 8. Difficulty Curve Coverage

| Level Range | Mode | Hint Type | Colors | Covered By |
|-------------|------|-----------|--------|------------|
| 1-30 | Easy | Direct | 4 | Flows 02, 03, 14, 15, 19 |
| 31-60 | Easy | Direct | 5 | — (same mechanics, more colors) |
| 61-100 | Easy | Direct | 6 | — |
| 101-200 | Advanced | Indirect | 5 | Flow 16 (via Duo indirect) |
| 201-350 | Advanced | Indirect | 6 | — |
| 351-500 | Advanced | Indirect | 7 | — |
| 501-600 | Advanced | Indirect | 8 | Flow 18 (via Duo 8 colors) |

---

## 9. Known Gaps (Out of Scope)

| Gap | Reason | Future Work |
|-----|--------|-------------|
| Free Play config UI | Not built yet | Add flow when UI ships |
| Level progression easy→advanced (level 101+) | Requires playing 100 levels | Consider level-skip dev tool |
| Solo 1-star win (6-7 attempts) | Covered implicitly by lose flow structure | Add if star rating bugs found |
| Physical device testing | Requires device farm | Consider BrowserStack/Sauce Labs |
| Performance benchmarks | Maestro not designed for perf | Use React Native Perf Monitor |
