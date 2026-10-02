# QuranGuessr

> **Master the Holy Quran through play.** An interactive, GeoGuessr-style learning platform that
> turns Quranic memorisation into a competitive, trackable skill.

---

## What is QuranGuessr?

QuranGuessr is a web application that gamifies the study of the Holy Quran. Inspired by the
location-guessing game GeoGuessr, it challenges players to identify verses, locate them within the
Mus-haf, and recall what comes before and after them — all through fast-paced, scored game modes.

Progress is tracked with a chess-style **ELO rating system** where you compete against individual
Quran pages. The better you know a page, the more your rating climbs and the page's difficulty
rating drops, creating a live difficulty map of all 604 pages across the global player base.

---

## Who is it for?

| Audience                    | How QuranGuessr helps                                                   |
| --------------------------- | ----------------------------------------------------------------------- |
| **Huffaz**                  | Reinforces memorisation by testing verse recall under time pressure     |
| **Casual learners**         | Low-stakes game modes let anyone explore the Quran at their own pace    |
| **Competitive learners**    | ELO rankings and daily ranked limits keep serious students motivated    |
| **Teachers & study groups** | Leaderboards and per-page difficulty stats reveal weak spots to work on |

---

## Why use QuranGuessr?

- **Active recall over passive reading** — answering under pressure cements memory far better than
  re-reading alone.
- **Immediate feedback** — every answer reveals the correct location or next verse instantly.
- **Measurable progress** — your ELO and streak track improvement over days, weeks, and months.
- **Community benchmarks** — see how you rank against other students worldwide, and discover which
  pages the entire community finds hardest.

---

## Game Modes

### 🏆 Missing Word Count — _Competitive (Ranked)_

A verse is displayed with some words hidden. You must count exactly how many words are missing.
Answers affect your ELO and the page's difficulty rating. Limited to **20 ranked attempts per day**
to keep the competition fair.

### 📖 Next Verse — _Casual_

Given an Ayah, pick which verse comes immediately after it from four shuffled choices. No ELO
pressure — perfect for daily warm-ups or exploring unfamiliar parts of the Quran.

### 📍 Verse Location — _Casual_

GeoGuessr-style: pinpoint the exact **page (1–604)** and **line (1–15)** where a displayed verse
appears in the Mus-haf. Scored 0–5 000 based on accuracy. Builds spatial knowledge of the Quran's
physical layout.

### 🌐 Meaning Match — _Coming Soon_

Match a verse to its correct translation. Will deepen comprehension of the meanings behind memorised
words.

---

## ELO Rating System

QuranGuessr uses a **dynamic K-factor ELO system** modelled on competitive chess. Each player holds
a global ELO rating, and each of the 604 Quran pages holds its own difficulty rating. A correct
answer on a hard page yields a larger ELO gain than a correct answer on an easy page, and vice
versa. Ratings converge over time to reflect true mastery.

---

## Leaderboard

**Player Rankings** — Top 50 players ordered by ELO, with rank, avatar, ELO, and games played. Your
position is highlighted when signed in.

**Page Difficulty** — All 604 pages ranked by collective community performance. Shows the hardest
and easiest pages along with Juz, Surah, and last-updated date — a live difficulty atlas of the
entire Quran.

---

## Authentication

Sign in with your **Quran Foundation (Quran.com) account** via OAuth2 / OIDC. No separate account
needed. Security features include PKCE, state validation, nonce checking, and database-stored
sessions.

---

## Tech Stack

| Layer        | Technology                               |
| ------------ | ---------------------------------------- |
| Framework    | Next.js 16 (App Router)                  |
| Styling      | Tailwind CSS v4                          |
| Database ORM | Prisma                                   |
| Database     | MongoDB                                  |
| Auth         | NextAuth.js v5 + Quran Foundation OAuth2 |
| Language     | TypeScript                               |
| Testing      | Vitest + Testing Library                 |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A MongoDB database
- Quran Foundation OAuth2 credentials (see [Quran Foundation](https://quran.foundation))

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment template and fill in your values
cp .env.example .env

# 3. Run database migrations
npx prisma migrate dev

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Useful Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Lint with ESLint
npm run format       # Format with Prettier
npm run test         # Run Vitest tests
npm run test:watch   # Watch mode
```

---

## Project Structure

```
app/
  about/            # About page
  api/              # API routes (auth, quiz)
  auth/             # Sign-in page
  components/       # Shared UI (TopAppBar, BottomNav, Hero…)
  leaderboard/      # Leaderboard page and components
  quiz/             # Quiz hub and all game modes
    locate-verse/
    missing-word-count/
    next-verse/
lib/
  elo.ts            # ELO rating logic
  prisma.ts         # Prisma client singleton
  quran-pages.ts    # Juz / Surah metadata helpers
prisma/
  schema.prisma     # Database schema
```

---

## License

MIT — see [LICENSE](LICENSE) for details.
