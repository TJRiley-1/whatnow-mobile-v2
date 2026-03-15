# Whatnow — Project Guide

## What is this?
Whatnow is a task management app for people with ADHD and task paralysis. Users swipe through tasks one at a time instead of staring at an overwhelming list. Built with Flutter, backed by Supabase.

## Tech Stack
- **Frontend:** Flutter (Dart), Riverpod state management, GoRouter navigation
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **Payments:** Currently Stripe (test mode) — evaluating RevenueCat for IAP
- **Analytics:** TBD (evaluating PostHog)
- **Local DB:** Drift (offline support)
- **Ads:** Google AdMob (test IDs currently)

## Architecture
- `lib/models/` — Data models (Task, Profile, Group)
- `lib/providers/` — Riverpod providers (state management)
- `lib/screens/` — Screen widgets organised by feature
- `lib/widgets/` — Reusable widgets
- `lib/config/` — Theme, environment, ranks, ad config
- `lib/data/` — Drift database for offline cache
- `lib/router/` — GoRouter configuration
- `supabase/functions/` — Edge Functions (stripe-webhook)
- `store/` — Store listing copy and privacy policy

## Brand
- **Name:** Whatnow
- **Domain:** whattasknow.com
- **Colour:** Purple #6750A4
- **Tagline:** "Stop overthinking. Start doing."
- **Bundle ID:** com.whatnow.app

## Working Process
1. **Research first** — Every strategic decision gets researched with pros/cons before any code is written
2. **Discuss and align** — Present options to the user, get explicit agreement
3. **Implement** — Only after alignment, write code
4. **Verify** — Run `flutter analyze && flutter build apk --debug` after changes
5. **Update CLAUDE.md** — As decisions are made, document them here for future sessions

## App Launch Checklist (Strategic Phase)

### Product Strategy (decide first)
- [ ] Paywall model — what's free vs premium, pricing tiers
- [ ] RevenueCat vs Stripe — IAP architecture decision
- [ ] Price localisation per region

### User Experience (design second)
- [ ] Customer onboarding flow — screens, data collected, personalisation
- [ ] Paywall screen — placement, content, conversion design
- [ ] In-app dashboard — user metrics, streaks, progress visualisation

### Internationalisation
- [ ] Languages to support at launch
- [ ] Localisation implementation (Flutter intl/arb)
- [ ] Store listing translations

### Brand & Design
- [ ] App icon — professional design direction
- [ ] Store screenshots — curated with marketing copy and device frames
- [ ] Feature graphic (Android)

### Web Presence
- [ ] whattasknow.com landing page
- [ ] Privacy policy hosted on domain

### Infrastructure
- [ ] Analytics platform (PostHog?)
- [ ] AdMob real IDs
- [ ] Release signing (keystore + iOS certs)

### Release (last)
- [ ] Release builds (AAB + IPA)
- [ ] Store submissions
- [ ] Stripe test → live (or RevenueCat live)

## Key Decisions Log
_Update this section as decisions are made_

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-15 | Supabase for backend | Already in use, good free tier, auth + DB + edge functions |
| 2026-03-15 | Stripe test mode set up | May be replaced by RevenueCat — Apple requires IAP for digital goods |
| 2026-03-15 | 20-task free limit | Needs validation — discuss in paywall strategy |
