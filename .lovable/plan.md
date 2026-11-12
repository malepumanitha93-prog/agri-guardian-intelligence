# AgroShield AI — Existing-App Upgrade

## Goal
Expand the existing AgroShield AI app in place, keeping its green glass visual identity and existing dashboard, disease scan, assistant, and environment screens. Treat data honestly: label live readings with their source and freshness; never present sample values as live.

## Build
1. Add email registration/sign-in with display name and farmer preferences, a session-aware account control, and user-owned Cloud records. Keep email confirmation enabled; show the confirmation-needed state rather than treating registration as a signed-in session.
2. Replace invented live dashboard/environment readings with real weather and air-quality data from a public weather API, plus a seven-day forecast and weather-driven irrigation guidance. Show a clear unavailable state if location or provider data cannot be obtained.
3. Add focused working tools for soil health and crop guidance, crop recommendations, irrigation/water estimation, fertilizer calculations, crop calendar, farm expenses, official Indian schemes, alerts, and saved disease scans. Persist applicable user records privately and retain saved reference information offline.
4. Expand the assistant to English, Hindi, and Telugu, voice input/output, and locally saved chat history. Add a downloadable/printable report for scan results.
5. Add live-market comparison around the official Indian mandi feed, but show it as unavailable until its API credential is supplied; do not invent current prices. Make new and existing navigation, forms, and responsive states work together.
6. Preserve the current color system, sidebar, and existing AI tools; add route-specific page metadata and appropriate empty/error/loading states.

## Technical approach
- Use the current TanStack Start, React, Tailwind, Recharts, Lovable Cloud, and generated browser Supabase client.
- Keep separate route files for distinct tools; use authenticated server functions for private database operations and row-level access rules for user data.
- Use public weather/air-quality endpoints only for real environmental readings; no new credential is assumed for those. Do not enable email auto-confirmation.
- Apply the required table schema and grants in a Cloud migration; store profile name/preferences and private scan, chat, and farm records with owner-scoped policies.
- Verify route navigation, auth states where available, main calculations, provider unavailable states, responsive layout, and build output.

## Constraints and dependencies
- The user selected the official Indian market feed and will supply its key later; current market prices must remain unavailable until then.
- Hosted sign-up confirmation and successful authenticated database writes depend on Cloud auth and session configuration; preserve email confirmation defaults.
