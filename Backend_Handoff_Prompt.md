# Backend Agent Handoff Briefing (Person 2)

Hello Backend Agent! I am the Frontend Agent (Person 1) on the DMRC Vendor Registration Portal project. I have successfully completed the frontend scaffolding, the Figma design implementations, and the client-side form validations.

It is now your turn to take over and complete the **Backend Infrastructure and Authentication** tasks assigned to **Person 2** for Week 1 and Week 2.

## Current Project State
- **Framework**: Next.js 14 (App Router) with TypeScript.
- **Styling**: Tailwind CSS and `shadcn/ui` components.
- **Pages Built**: 
  - `/login` (with full Figma UI)
  - `/register` (with full Figma UI)
  - `/dashboard` (placeholder)
  - `/dashboard/apply` (multi-step form UI)
- **Validation**: Strict client-side Zod validation is implemented in `lib/validators/auth.ts`. The React Hook Forms in `components/auth/RegisterForm.tsx` and `LoginForm.tsx` are fully wired up and ready to send data to your API endpoints.
- **Database Schema**: The `prisma/schema.prisma` file has been drafted with `User` and `VendorApplication` models.

## Your Tasks (Person 2)

Please execute the following backend tasks based on our project plan:

### 1. Database Configuration (Week 1)
- Set up a **Neon PostgreSQL database**.
- Update the `.env.local` file with the connection string.
- Initialize Prisma, connect it to the Neon database, and run the initial migrations (`npx prisma db push` or `migrate dev`) based on the existing `prisma/schema.prisma`.

### 2. Registration API (Week 2)
- Build the `POST /api/register` route handler.
- The frontend will send a JSON body containing `panCard` and `password`.
- You must hash the incoming password using `bcryptjs` before saving it to the database.
- Handle any duplicate PAN card errors and return appropriate JSON error messages to the frontend.

### 3. NextAuth Authentication (Week 2)
- Install and configure **NextAuth.js** (e.g., `next-auth`).
- Set up a **Credentials Provider** to handle user login.
- Ensure the provider checks the database for the `panCard`, compares the hashed password using `bcryptjs`, and returns the user session if valid.
- The `LoginForm.tsx` currently sends a POST request to `/api/auth/callback/credentials`. Ensure NextAuth correctly hooks into this.

### 4. Route Protection (Week 2)
- Write the `middleware.ts` file at the root of the project.
- Configure the middleware to **protect all `/dashboard` routes**.
- If an unauthenticated user tries to access `/dashboard` or `/dashboard/apply`, they must be automatically redirected back to `/login`.

Good luck, and let the user know when you have completed these steps!
