# Winter Arc Buddy

"SHOW UP. PROVE IT. DON'T LOSE."

Winter Arc Buddy is a serious, production-grade two-player accountability platform. It connects two players for a fixed duration, tracking daily fitness proofs through a strict system of partner reviews, rest days, and life deductions.

## Features
- **Two-Player Connection**: Secure invite and blood oath contract.
- **Daily Proofs**: Upload daily fitness photos securely via Neon Object Storage.
- **Partner Review**: Proofs must be approved by the partner.
- **The Punisher**: Automated daily cron job that deducts lives for missing or rejected proofs.
- **Brutalist UI**: High-contrast, Swiss-inspired, distraction-free aesthetic.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Database**: Neon (Serverless Postgres)
- **ORM**: Prisma
- **Storage**: Neon Object Storage (S3-compatible)
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS & Framer Motion

## Installation

```bash
# Install dependencies
npm install

# Set up your environment variables
cp .env.example .env
# (Fill in your Neon Database URLs and Object Storage keys)
```

## Database Setup (Neon)

1. Connect to your Neon project.
2. Ensure you have two connection strings in `.env`:
   - `DATABASE_URL` (Pooled connection for Next.js app)
   - `DATABASE_URL_UNPOOLED` (Direct connection for Prisma migrations)
3. Push the schema to your database:
```bash
npx prisma db push
```

## Storage Setup (Neon Object Storage)
The app uses Neon's native Object Storage.
You must provision a `public_read` bucket (e.g., `winter-arc-proofs`) in your Neon project.
The application uploads files directly to this S3-compatible bucket via `@neon/files-sdk`.

## Development

```bash
npm run dev
```

## Testing & Validation
Run the built-in quality gates before pushing code:

```bash
npm run typecheck   # Validate TypeScript
npm run lint        # Run ESLint
npm run test        # Run automated tests
npm run build       # Verify production build
```

## Deployment (Vercel)
1. Import the repository into Vercel.
2. Add your `.env` variables to the Vercel project settings.
3. Add `npx prisma db push` as part of your build step (or run manually).
4. Deploy!
