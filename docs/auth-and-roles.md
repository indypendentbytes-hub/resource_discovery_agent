# Authentication & Roles — Implementation Guide

This document explains the auth foundation that was added to the Resource Discovery Agent and how the interns should extend it for the buyer-seller platform.

## Goals

1. **Resource Discovery Agent** → login is *optional*. People can discover resources freely. Login is only prompted when they want to save a plan or track progress.
2. **Grower (Seller) portal** → required login + `grower` role.
3. **Buyer portal** → required login + `buyer` role.
4. One shared identity system so a person can be both a grower *and* use the Discovery Agent.

## Technology Choice

We use **[Clerk](https://clerk.com)**.

Why Clerk:
- Excellent React / Vite support
- Built-in UserButton, SignIn modal, organizations
- Easy role storage via `publicMetadata`
- Can later add Organizations for multi-user grower businesses
- Good security defaults

### Setup (one-time)

1. Create a free account at https://dashboard.clerk.com
2. Create an application (choose "React" or "Vite")
3. Copy the **Publishable Key** → put in `.env` as `VITE_CLERK_PUBLISHABLE_KEY`
4. Copy the **Secret Key** → put in `.env` as `CLERK_SECRET_KEY` (server only)
5. In Clerk Dashboard → User & Authentication → Email, Phone, Username → enable the methods you want (magic link is recommended for low friction)

## Roles

Defined in `src/lib/roles.js`:

| Role     | Meaning                              | Where used                          |
|----------|--------------------------------------|-------------------------------------|
| `user`   | Default community member             | Resource Discovery Agent            |
| `grower` | Independent grower / seller          | Seller side of aggregation platform |
| `buyer`  | Buyer on the aggregation platform    | Buyer side of aggregation platform  |
| `admin`  | INDYpendent Bytes staff              | Internal tools                      |

Roles are stored in Clerk as:

```js
user.publicMetadata = {
  role: "grower"           // primary role
  // or
  roles: ["user", "grower"] // multiple roles
}
```

You can set these manually in the Clerk Dashboard (Users → select user → Public metadata) or via the Clerk Backend API when a user completes “Become a Grower” / “Register as Buyer” flows.

## Current Frontend Behavior

- Header shows **“Sign in to save progress”** when logged out.
- After the agent returns recommendations, a soft prompt appears offering to save the pathway.
- When signed in, a small “Progress tracking is active” banner appears.
- The `user.id` and role are already passed into the search call so the backend can personalize later.

## Recommended Database Schema (for progress + platform)

Use Supabase, Neon, or any Postgres. Enable **Row Level Security**.

```sql
-- Core profile (extends Clerk user)
create table user_profiles (
  user_id text primary key,          -- Clerk user id
  display_name text,
  location text,
  business_stage text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Grower-specific data
create table grower_profiles (
  user_id text primary key references user_profiles(user_id),
  business_name text not null,
  acreage numeric,
  certifications text[],
  products_offered text[],
  created_at timestamptz default now()
);

-- Buyer-specific data
create table buyer_profiles (
  user_id text primary key references user_profiles(user_id),
  organization_name text,
  buying_volume text,
  preferred_categories text[],
  created_at timestamptz default now()
);

-- Saved resource pathways from the Discovery Agent
create table saved_plans (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references user_profiles(user_id),
  title text,
  goal text,
  plan_data jsonb not null,          -- the full recommendation pathway
  created_at timestamptz default now()
);

-- Progress against individual resources
create table resource_progress (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references user_profiles(user_id),
  resource_id text not null,
  status text not null check (status in ('suggested', 'contacted', 'in_progress', 'completed', 'blocked', 'skipped')),
  notes text,
  updated_at timestamptz default now(),
  unique(user_id, resource_id)
);
```

### Row Level Security example

```sql
alter table saved_plans enable row level security;

create policy "Users can only see their own plans"
  on saved_plans for all
  using (user_id = auth.uid()::text)   -- or clerk_user_id() depending on your setup
  with check (user_id = auth.uid()::text);
```

## How Interns Should Extend This

### 1. Grower / Buyer registration flows
Create simple pages:
- `/become-grower` → collect business info → call Clerk Backend API to set `publicMetadata.role = "grower"` + insert into `grower_profiles`
- `/become-buyer` → same pattern for buyers

### 2. Protect routes
```jsx
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { hasRole, ROLES } from "./lib/roles";

function GrowerDashboard() {
  const { user } = useUser();
  if (!hasRole(user, ROLES.GROWER)) {
    return <p>You need a Grower account to access this area.</p>;
  }
  return <div>Seller dashboard…</div>;
}
```

### 3. Shared backend
All portals (Discovery Agent, Seller, Buyer) should talk to the **same API** and the **same database**. Do not create a second user table.

## Security Reminders

- Never commit `.env` or real API keys.
- Never put `CLERK_SECRET_KEY` in frontend code.
- Use Row Level Security so users can only read/write their own rows.
- When the buyer-seller platform stores financial or personal data, add encryption and audit logging.

## Next Implementation Steps (suggested order)

1. Add Clerk keys and test sign-in / sign-out on the Discovery Agent.
2. Create the Postgres tables above.
3. Build “Save this plan” that writes to `saved_plans` when the user is signed in.
4. Build simple Grower and Buyer registration pages that set the correct role.
5. Scaffold the Seller and Buyer dashboards (can be separate routes or a separate Vite app that shares the same Clerk project).
