# Drizzle ORM Setup

This project now uses Drizzle ORM for database migrations and type-safe database operations with Supabase.

## Configuration

- **Schema**: `drizzle/schema.ts` - Contains your database schema definitions
- **Config**: `drizzle.config.ts` - Drizzle Kit configuration
- **Database client**: `app/lib/db.ts` - Database connection and client

## Environment Variables

Make sure to set `DATABASE_URL` in your environment:
```bash
DATABASE_URL=postgres://postgres:<password>@db.<project>.supabase.co:5432/postgres
```

## Available Scripts

- `npm run db:generate` - Generate SQL migrations from schema changes
- `npm run db:push` - Push schema changes directly to database (for development)
- `npm run db:studio` - Open Drizzle Studio for database exploration

## Current Schema

The initial schema includes:
- `users` table that references Supabase Auth users via foreign key
- Automatic cascade delete when auth user is removed
- Created timestamp for tracking user registration

## Usage Example

```typescript
import { db } from "@/lib/db";
import { users } from "../../drizzle/schema";

// Create a user profile
await db.insert(users).values({
  id: authUser.id, // Use the Supabase Auth user ID
});

// Query users
const allUsers = await db.select().from(users);
```

## Migration Workflow

1. Modify schema in `drizzle/schema.ts`
2. Run `npm run db:generate` to create migration files
3. Review generated SQL in `supabase/migrations/`
4. Apply migrations via Supabase CLI or push directly with `npm run db:push` 