## MotorIQ Front (Driver + Admin Web)

This repo contains a **frontend prototype** built with **Expo (React Native + React Native Web)**.
It includes:

- **Driver app** (mobile-first UI): report an incident, track claims, profile, local mock data.
- **Admin web dashboard** (desktop UI): claims/metrics overview (no real auth, fake entry).

All data is **mocked and persisted locally** using Zustand + AsyncStorage (works on web + mobile).

---

## Requirements

- Node.js 18+ recommended
- npm

---

## Install

```bash
npm install
```

---

## Run (dev)

### Web

```bash
npm run web
```

### Mobile (Expo Go)

```bash
npm start
```

Then scan the QR code with **Expo Go**.

---

## Routes (Web)

The app uses React Navigation linking.

- **Landing / fake entry**: `/acceuil`
- **Driver app**: `/app`
- **Admin dashboard**: `/admin`

Notes:

- The Admin dashboard is **separate from the Driver UI** (different route and layout).
- On web, **camera capture** may open a file picker depending on browser permissions/limitations.
  On Android/iOS (Expo Go), it opens the native camera UI.

---

## Local persistence

The global store (`stores/claimsStore.ts`) is persisted under the key:

- `motoriq-claims-store`

This keeps:

- created claims
- added vehicles
- profile edits
- theme (light/dark)

across refreshes / app restarts.

---

## Production build (Web export)

Create a static build:

```bash
npm run web:export
```

This generates a `dist/` folder you can deploy to any static host.

To serve it locally:

```bash
npm run web:serve
```

---

## Project structure (high level)

- `screens/` : screens (Driver + Admin + Landing)
- `components/` : reusable UI components (PolicyCard, ClaimCard, TimelineProgress, Assistant panel)
- `stores/` : Zustand store (mock data + persistence)
- `navigation/` : React Navigation configuration + web routes

