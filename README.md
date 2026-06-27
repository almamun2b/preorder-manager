# Preorder Manager

A modern preorder management system built with Next.js 16, React 19, and Prisma ORM.

## Features

- **Database Flexibility**: Seamlessly switch between local SQLite and remote [Turso](https://turso.tech) SQLite databases using `@prisma/adapter-libsql`. The libsql adapter provides unified support for both environments without code changes.
- **Custom Query Builder**: Raw SQL query builder in `src/backend/utils/queryBuilder.ts` for optimized database operations with case-insensitive search support using `LOWER()` and `LIKE` for SQLite.
- **Custom Fetch Utility**: Type-safe HTTP client (`src/lib/fetch/index.ts`) with caching, error handling, interceptors, and Next.js ISR (Incremental Static Regeneration) support via cache tags.
- **Server Actions**: Optimistic mutations with automatic cache revalidation using `revalidatePath` for seamless user experience.
- **Type-Safe**: Full TypeScript coverage with Zod validation schemas for API routes and form inputs.
- **Modern UI**: Built with Tailwind CSS v4 and shadcn/ui components for a polished, responsive interface.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS v4, shadcn/ui
- **Database**: Prisma ORM with libsql adapter
- **Validation**: Zod schemas
- **Forms**: React Hook Form with Zod resolver
- **Styling**: Tailwind CSS v4 with custom animations

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Configure environment variables (see [.env.example](.env.example))

### Database Setup

**For Local SQLite:**

```bash
pnpm db:push
```

**For Turso (Remote SQLite):**

1. Create a Turso account at [turso.tech](https://turso.tech)
2. Set up your database and get the connection URL and auth token
3. Update `.env` with your Turso credentials:
   - `DATABASE_URL` - Your Turso database URL
   - `DATABASE_AUTH_TOKEN` - Your Turso auth token (only required for remote Turso DB)
4. Run migrations:

```bash
pnpm db:push
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm format` - Format code with Prettier
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:push` - Push schema to database
- `pnpm db:generate` - Generate Prisma client

## Code Quality

This project uses ESLint, Prettier, and Husky for maintaining code quality:

- **ESLint**: Lints JavaScript/TypeScript code for errors and best practices
- **Prettier**: Formats code consistently across the project
- **Husky**: Git hooks that run lint-staged on pre-commit to ensure only clean code is committed
- **lint-staged**: Runs ESLint and Prettier on staged files before commit

## API Documentation

See [test-api.http](test-api.http) for comprehensive API endpoint documentation and examples.

## Project Structure

- `src/app/` - Next.js App Router pages and API routes
  - `(dashboard)/` - Dashboard layout and pages
  - `actions/` - Server actions for mutations
  - `api/` - API route handlers
- `src/components/` - Reusable UI components
  - `ui/` - Base shadcn/ui components
  - `modules/` - Feature-specific components (preorder, etc.)
- `src/services/` - Business logic and API service layer
  - `preorder.ts` - Preorder CRUD operations with caching
- `src/backend/` - Backend utilities
  - `modules/` - Backend feature modules (preorder types, validation)
  - `utils/` - Query builder for raw SQL operations
- `src/lib/` - Shared utilities
  - `fetch/` - Custom HTTP client with caching and error handling
  - `date.ts` - Date formatting utilities
- `prisma/` - Prisma schema and migrations

## License

MIT
