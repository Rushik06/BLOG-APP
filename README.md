# PUBLIC CMS WEBSITE

A full-stack blog platform built with **Next.js 16** (frontend) and **Strapi 5** (headless CMS backend), featuring authentication, a subscriber system, a dashboard with analytics, and a content-rich landing page.

---

## Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui, Radix UI
- **Auth:** NextAuth.js v4 (JWT + Strapi credentials)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Package Manager:** pnpm

### Backend
- **CMS:** Strapi 5
- **Database:** PostgreSQL 15 (via Docker)
- **Runtime:** Node.js ≥ 20

---

## Project Structure

```
BLOG-APP/
├── app/                        # Next.js App Router pages & logic
│   ├── api/                    # Route handlers
│   │   ├── auth/[...nextauth]/ # NextAuth endpoint
│   │   ├── stats/              # Subscriber stats endpoint
│   │   └── subscribe/          # Newsletter subscription endpoint
│   ├── blog/                   # Blog listing & individual post pages
│   ├── dashboard/              # Protected analytics dashboard
│   ├── demo/                   # Demo page with modal
│   ├── features/               # Features page
│   ├── login/ & signup/        # Auth pages
│   ├── pricing/                # Pricing page
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript type definitions
│   ├── constants/              # Static content constants
│   └── metadata/               # Per-page SEO metadata
├── components/                 # Reusable UI components
│   ├── blog/                   # BlogCard, BlogClient, RenderContent
│   ├── dashboard/              # Charts
│   ├── features/               # FeatureCard
│   ├── layout/                 # Navbar, Footer
│   ├── pricing/                # PricingCard
│   └── ui/                     # Button, Card, Input, etc.
├── lib/                        # Utilities & API helpers
│   ├── strapi.ts               # Strapi fetch wrapper
│   ├── strapi-helpers.ts       # Rich text parser
│   └── utils.ts                # General utilities
├── backend/
│   ├── docker-compose.yml      # PostgreSQL + Strapi containers
│   └── app/                    # Strapi application source
│       └── src/api/            # Content types (blog, pricing, features, etc.)
├── public/                     # Static assets
└── package.json
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) ≥ 20
- [pnpm](https://pnpm.io/) ≥ 10
- [Docker](https://www.docker.com/) & Docker Compose (for the backend)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd BLOG-APP
```

### 2. Start the Backend (Strapi + PostgreSQL)

Copy the example environment file and fill in your values:

```bash
cd backend
cp .env.example .env
```

Required backend environment variables:

```env
POSTGRES_DB=strapi
POSTGRES_USER=strapi
POSTGRES_PASSWORD=your_password
POSTGRES_DATA_PATH=./data/postgres

DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
ADMIN_JWT_SECRET=your_admin_jwt_secret
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your_api_token_salt
TRANSFER_TOKEN_SALT=your_transfer_token_salt
```

Start the containers:

```bash
docker compose up -d
```

Strapi will be available at `http://localhost:1337`. On first run, visit the admin panel to create an admin account and configure your content types.

### 3. Set Up the Frontend

From the project root, install dependencies:

```bash
pnpm install
```

Create a `.env.local` file:

```env
# Strapi URLs
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api
NEXT_PUBLIC_STRAPI_BASE=http://localhost:1337

# Strapi API token (generate in Strapi Admin → Settings → API Tokens)
STRAPI_API_TOKEN=your_strapi_api_token

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Run ESLint and auto-fix issues |
| `pnpm format` | Format all files with Prettier |

---

## Features

- **Blog** — Dynamic blog posts fetched from Strapi, with rich text rendering and a reading progress indicator.
- **Authentication** — Credential-based login/signup via NextAuth.js, backed by Strapi's users-permissions plugin.
- **Dashboard** — Protected page with charts and analytics (subscriber counts, activity, stats).
- **Landing Page** — Fully CMS-driven landing page with features, testimonials, and pricing sections.
- **Pricing Page** — Dynamic pricing cards managed in Strapi.
- **Dark Mode** — Theme toggling via `next-themes`.
- **Code Quality** — ESLint, Prettier, Husky pre-commit hooks, and Commitlint for conventional commits.

---

## Backend Content Types (Strapi)

| Content Type | Description |
|---|---|
| `blog` | Blog posts |
| `blog-page` | Blog listing page config |
| `landing-page` | Landing page content |
| `features-page` / `feature` | Features page and individual feature entries |
| `pricing` / `pricing-page` | Pricing tiers and page config |
| `subscriber` | Email newsletter subscribers |
| `stat` | Dashboard statistics |
| `activity` / `recent-activity` | Dashboard activity feed |
| `testimonial` | Customer testimonials |
| `ui-badge` / `ui-config` | UI configuration |
| `nav-link` | Navigation links |
| `inventory` | Inventory data |

---

## Deployment

### Frontend

The easiest way to deploy the Next.js frontend is via [Vercel](https://vercel.com). Set all environment variables from `.env.local` in the Vercel project settings.

### Backend

The Strapi backend can be deployed to any server that supports Docker. For production, ensure you:

1. Use strong secrets for all environment variables.
2. Configure `NODE_ENV=production` in the Strapi container.
3. Set up a persistent volume for the PostgreSQL data.
4. Restrict Strapi API token permissions to only what the frontend requires.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m "feat: add new feature"`
4. Push and open a Pull Request.

Commit messages are linted with Commitlint and code is auto-formatted on commit via Husky + lint-staged.

---

The easiest way to deploy the Next.js frontend is via [Vercel](https://vercel.com). Set all environment variables from `.env.local` in the Vercel project settings.

### Backend

The Strapi backend can be deployed to any server that supports Docker. For production, ensure you:

1. Use strong secrets for all environment variables.
2. Configure `NODE_ENV=production` in the Strapi container.
3. Set up a persistent volume for the PostgreSQL data.
4. Restrict Strapi API token permissions to only what the frontend requires.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m "feat: add new feature"`
4. Push and open a Pull Request.

Commit messages are linted with Commitlint and code is auto-formatted on commit via Husky + lint-staged.


