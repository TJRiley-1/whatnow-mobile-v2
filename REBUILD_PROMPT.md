# Whatnow Mobile - React Native + Expo Rebuild

## Context
I'm rebuilding the mobile app for Whatnow (task management for ADHD task paralysis) from Flutter to React Native + Expo. The web version exists at https://github.com/TJRiley-1/Whatnow-com/tree/main/web and uses Supabase backend.

## Supabase Configuration

**Use existing project:** Yes, from Whatnow web app
**Schema:** Already exists (see supabase-schema.sql in repo)
**Google OAuth:** [ASK USER - is this configured in your Supabase?]

### Environment Variables (will be added to .env)
```
https://jntgomnsvixoroponjcx.supabase.co
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpudGdvbW5zdml4b3JvcG9uamN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4OTUzMDYsImV4cCI6MjA4NTQ3MTMwNn0.nP6ZmxeOZthqkisBBYXfz8OZrWssuocpLNj5ITs_KIw
```

### Database Tables (Reference)
- `profiles`: User data, points, rank (auto-created on signup)
- `tasks`: social (low/medium/high), energy (low/medium/high), time (minutes)
- `completed_tasks`: History for analytics
- `groups` + `group_members`: Leaderboards
- `weekly_leaderboard`: View for ranking display

### Key Schema Details
- Social battery: stored as "low" | "medium" | "high"
- Energy level: stored as "low" | "medium" | "high"
- Time estimate: integer (minutes)
- Points: awarded on task completion, stored in completed_tasks table

## Project Specifications

### Core Purpose
Help users overcome task paralysis by:
1. Filtering tasks by time available, social battery, energy level
2. "What Next" feature - swipe through task cards (yes/no) until one is chosen
3. Gamification: points, groups, leaderboards, rankings

### Task Entry UX Flow
Easy questions first (single-click) → Text entry later (when committed):
1. Task name (text - late in flow)
2. Social battery required (0-10 scale - early)
3. Energy/physical requirements (0-10 scale - early)
4. Time estimate (15min/30min/1hr/2hr+ - early)
5. Category/tags (optional)

### Key Features
- Task filtering by: time available, social battery, energy level
- "What Next" swipe interface (like Tinder for tasks)
- Task management: view all, filter by status (pending/in-progress/done)
- Points system, leaderboards, user groups
- Offline-first with Supabase sync
- User accounts (required for all features)

### Tech Stack Requirements

**Framework:** React Native + Expo (managed workflow)
**Language:** TypeScript
**Styling:** NativeWind (Tailwind for React Native)
**Backend:** Supabase (PostgreSQL + Auth + Realtime)
**Navigation:** Expo Router (file-based routing)
**State:** Zustand for local state, React Query for server state
**Offline:** Supabase offline-first with local storage fallback

**Key Libraries:**
- @supabase/supabase-js (backend)
- @tanstack/react-query (data fetching)
- zustand (state management)
- nativewind (styling)
- expo-router (navigation)
- react-native-gesture-handler + reanimated (swipe cards)
- expo-secure-store (token storage)

### Monetization Architecture
**Free Tier:**
- Limited to 20 active tasks
- Show Google AdMob banner ads
- Basic features only

**Premium Tier (Subscription):**
- Unlimited tasks
- No ads
- Advanced features (custom categories, analytics, etc.)
- Stripe integration for payments

### Project Structure
```
whatnow-mobile-v2/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Auth flow (login, signup)
│   ├── (tabs)/            # Main app tabs
│   │   ├── index.tsx      # What Next (swipe interface)
│   │   ├── tasks.tsx      # Task management
│   │   ├── profile.tsx    # User profile + subscription
│   └── _layout.tsx        # Root layout
├── components/
│   ├── TaskCard.tsx       # Swipeable task card
│   ├── TaskForm.tsx       # Add/edit task form
│   ├── FilterPanel.tsx    # Filter by time/energy/social
│   └── AdBanner.tsx       # AdMob integration
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── stripe.ts          # Stripe helpers
│   └── analytics.ts       # Usage tracking
├── hooks/
│   ├── useAuth.ts         # Authentication
│   ├── useTasks.ts        # Task CRUD (React Query)
│   └── useSubscription.ts # Premium status check
├── types/
│   └── index.ts           # TypeScript types
├── app.json               # Expo config
├── package.json
└── README.md
```

### Supabase Schema (Reference)
The existing schema from the web app should have:
- `profiles` table (user data, subscription status, points)
- `tasks` table (task details, user_id FK, status, social_battery, energy_required, time_estimate)
- `user_groups` and `group_memberships` (for leaderboards)
- Row-level security policies

### Screens to Build

1. **Auth Flow**
   - Login (email/password + Google OAuth)
   - Signup
   - Onboarding (explain features)

2. **What Next (Home)**
   - Filter panel: time available, social battery, energy level
   - Swipe cards (gesture-based yes/no)
   - Show selected task with "Start Task" button

3. **Task Management**
   - List view (pending/in-progress/done tabs)
   - Add task modal (multi-step form with smart question ordering)
   - Edit/delete tasks
   - Mark complete → award points

4. **Profile & Settings**
   - User stats (points, completed tasks)
   - Subscription status + upgrade CTA
   - Group/leaderboard access
   - Settings (notifications, preferences)

### Development Requirements

1. **Start with Expo managed workflow:**
```bash
   npx create-expo-app@latest whatnow-mobile-v2 --template tabs
   cd whatnow-mobile-v2
```

2. **Install core dependencies first:**
```bash
   npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
   npm install @supabase/supabase-js @react-native-async-storage/async-storage
   npm install @tanstack/react-query zustand
   npm install nativewind tailwindcss
   npm install react-native-gesture-handler react-native-reanimated
```

3. **Configure NativeWind:**
   - Create `tailwind.config.js`
   - Update `babel.config.js` with nativewind plugin
   - Create `global.css` for Tailwind directives

4. **Supabase Setup:**
   - Environment variables in `.env` (EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY)
   - Initialize client in `lib/supabase.ts`
   - Use expo-secure-store for auth token persistence

5. **Build Incrementally:**
   - Phase 1: Auth flow + basic navigation
   - Phase 2: Task CRUD (no swipe yet, just list)
   - Phase 3: Filters + "What Next" swipe interface
   - Phase 4: Points, leaderboards, groups
   - Phase 5: Subscription + AdMob integration

### Testing Strategy
- Use Expo Go app for instant testing during development
- `npx expo start` → scan QR code on phone
- Test offline: turn off WiFi, verify Supabase queue works

### Build & Deploy (Later Phase)
```bash
# Android preview build (for testing)
eas build --profile preview --platform android

# Production build for Google Play
eas build --profile production --platform android

# Submit to Play Store
eas submit --platform android
```

## Instructions for Claude Code

1. Initialize the Expo project with TypeScript + tabs template
2. Set up the folder structure as specified above
3. Install all required dependencies
4. Configure NativeWind, Supabase client, and Expo Router
5. Build the authentication flow first (login/signup screens)
6. Create the task data models and Supabase queries (React Query hooks)
7. Build the "What Next" swipe interface (core feature)
8. Implement task management screens (list, add, edit)
9. Add filtering panel (time/social/energy)
10. Create profile screen with subscription upgrade flow
11. Integrate points system and leaderboards
12. Add AdMob banner for free tier users
13. Implement Stripe subscription flow (web checkout for now, native later)
14. Test offline-first behavior with Supabase

## Design Guidelines
- Clean, minimal UI (not overwhelming for ADHD users)
- Large tap targets (minimum 48x48dp)
- High contrast colors
- Clear visual hierarchy
- Smooth animations (swipe gestures)
- Dark mode support
- Accessibility: screen reader support, font scaling

## Success Criteria
- User can create account, log in
- User can add tasks with all metadata (social, energy, time)
- Filters work correctly (show only matching tasks)
- Swipe interface feels smooth and responsive
- Tasks sync between sessions (offline → online)
- Points are awarded on task completion
- Free tier shows ads, premium tier is ad-free
- App works offline with queue sync when online

## Questions to Ask Before Building
1. Should I use the existing Supabase project from the web app, or create a new one?
2. What Supabase table schema exists? (I'll need to match it or create migration)
3. Google OAuth already configured in Supabase?
4. Do you have Stripe account set up?
5. AdMob account ready? (I'll need the app ID)

---

Please build this step-by-step, explaining key decisions, and asking for clarification when needed. Start with project initialization and core setup.
```

---

## Phase 4: Vercel Setup for Web (Parallel Task)

While Claude Code rebuilds mobile, you can migrate the web app:

### 4.1 Vercel Account Setup
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import the `Whatnow-com` repository
4. Vercel will auto-detect settings

### 4.2 Environment Variables
In Vercel dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_ke
