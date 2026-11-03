# EcoPulse — Sustainability Web Platform

> **Small Actions. Measurable Impact.**  
> Built by **Team Codyssey** • Support Contact: [ankitkumarlal2006@gmail.com](mailto:ankitkumarlal2006@gmail.com)

EcoPulse is a production-grade personal and household sustainability web platform. It enables individuals, students, and community groups to understand everyday environmental footprints, track consumption trends over time, and implement actionable, rules-based efficiency steps grounded in verified scientific benchmarks.

---

## 1. Core Architecture & Stack

- **Framework:** Next.js (App Router) with React & TypeScript (strict mode throughout).
- **Styling & Visual Design:** Tailwind CSS with the official 6-color EcoPulse brand palette (Forest Green `#12372A`, Emerald Green `#16A36A`, Natural White `#F5F8F2`, Fresh Lime `#D9F99D`, Pure White `#FFFFFF`, Sage Grey `#64756B`) and WCAG AA contrast companion tokens.
- **Database & ORM:** SQLite database via Prisma ORM (`prisma/schema.prisma`) featuring declarative migrations, foreign key constraints with cascading deletes, multi-table transactions, and indexing on `[userId, date]` and `[userId, category]`.
- **Security & Session Layer:** Cryptographically generated persistent session tokens stored in secure `httpOnly`, `SameSite=Lax` cookies; bcrypt password hashing with salt rounds; in-memory sliding-window rate limiting; Zod schema validation on both client and server; and strict server-side authorization on every user-owned record.
- **Calculation Service:** Isolated calculation module (`src/lib/calculations/`) with unit normalization, boundary validation, and zero false precision.

---

## 2. Emission Factors & Scientific Sources

EcoPulse applies traceable factors from official government and peer-reviewed sources:
- **Grid Electricity (India):** 0.716 kg CO₂e / kWh — *Central Electricity Authority (CEA) CO₂ Baseline Database for the Indian Power Sector, User Guide Version 19.0 (2024)*.
- **Grid Electricity (Global/UK):** 0.207 kg CO₂e / kWh — *UK Department for Energy Security and Net Zero (DESNZ) / DEFRA Conversion Factors 2024*.
- **Natural Gas:** 0.183 kg CO₂e / kWh — *UK DESNZ / DEFRA 2024*.
- **Domestic LPG:** 2.983 kg CO₂e / kg (42.36 kg / 14.2 kg cylinder) — *IPCC National GHG Inventories & Indian Oil Corp lifecycle reference*.
- **Passenger Transport:** Average petrol car (0.171 kg/km), diesel car (0.168 kg/km), electric vehicle (0.053 kg/km), motorcycle (0.084 kg/km), city bus (0.041 kg/km), electric metro (0.028 kg/km), flights with Radiative Forcing (0.246 kg/km domestic, 0.193 kg/km long-haul) — *DEFRA 2024 & DMRC Benchmarks*.
- **Diet & Food:** Beef portion (6.61 kg CO₂e), poultry portion (1.82 kg CO₂e), vegetarian meal (0.85 kg CO₂e), vegan meal (0.49 kg CO₂e) — *Poore & Nemecek (Science 2018) & Nature Food (2023)*.
- **Municipal Water:** 0.000344 kg CO₂e / litre (0.344 kg/m³) — *UKWIR & DEFRA 2024*.
- **Municipal Waste:** Landfill mixed waste (0.587 kg CO₂e/kg), managed aerobic compost (0.010 kg CO₂e/kg), dry recycling (0.021 kg CO₂e/kg) — *IPCC Waste Model & DEFRA 2024*.

---

## 3. Environment Configuration

Create a local `.env` file for development. In Vercel, add the production values under **Project Settings → Environment Variables**. Never commit `.env` or real credentials to Git.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
AUTH_SECRET="replace-with-a-unique-random-secret-of-at-least-32-characters"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SUPPORT_EMAIL="ankitkumarlal2006@gmail.com"
```

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string used by the application |
| `DIRECT_URL` | Direct PostgreSQL connection used by Prisma for database operations |
| `AUTH_SECRET` | Private secret used to protect sessions and tokens; use a unique value |
| `NEXT_PUBLIC_APP_URL` | Local URL in development; set this to your deployed website URL in Vercel |
| `SUPPORT_EMAIL` | Public support contact address |

If your database provider gives you both pooled and direct connection strings, use the pooled string for `DATABASE_URL` and the direct string for `DIRECT_URL`. Replace the sample database values and secret with your own before running the app.

## 4. Setup, Migration & Seed Steps

```bash
# 1. Install dependencies
npm install

# 2. Push database schema and generate Prisma client
npx prisma db push
npx prisma generate

# 3. Seed emission factors, recommendations, and starter challenges
npx tsx prisma/seed.ts

# 4. Run automated test suites (Calculations, Security Isolation, E2E Walkthrough)
npm test

# 5. Build for production
npm run build

# 6. Start production server
npm start
```

---

## 5. Automated Verification & Test Coverage

The platform includes 26 automated unit and integration tests passing with 0 failures:
- `src/lib/calculations/calculator.test.ts`: Validates CEA grid calculations, unit conversions (miles to km, cylinders to kg), radiative forcing for aviation, rejection of incompatible units, non-positive number rejection, boundary bounds, and precision guarantees.
- `tests/auth-isolation.test.ts`: Proves strict tenant isolation (User B cannot read, update, or delete User A's activities), and validates account deletion cascading.
- `tests/e2e-walkthrough.test.ts`: Tests complete 12-step user walkthrough (Sign up, verification, onboarding, multi-category activity logging, dashboard metrics aggregation, goal tracking, action coach status update, challenge enrollment, community leaderboard opt-in, CSV export, JSON archive, and account deletion).

---

## 6. Privacy & Legal Compliance Notice

- Complete, finished **Privacy Policy** (`/privacy`) and **Terms of Service** (`/terms`) are published and linked from every page header and footer.
- Contact for support is directly accessible at: `ankitkumarlal2006@gmail.com`.
- *Build Note:* As good practice before launching to public consumer traffic, the website operator should have local counsel review the privacy and terms pages for any region-specific requirements.

© 2026 EcoPulse. All rights reserved. Built by Team Codyssey.
