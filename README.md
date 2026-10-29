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

Copy `.env.example` to `.env`:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="ecopulse-production-secure-auth-secret-key-2026-v1"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
SUPPORT_EMAIL="ankitkumarlal2006@gmail.com"
```

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Connection string for SQLite or PostgreSQL |
| `AUTH_SECRET` | Secret key used for cryptographic session and token hashing (min 32 chars) |
| `NEXT_PUBLIC_APP_URL` | Public base URL of the deployed application |
| `NODE_ENV` | Application environment (`development`, `test`, `production`) |
| `SUPPORT_EMAIL` | Official support contact address |

---

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
