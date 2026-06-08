# DMRC Vendor Portal — Full Agent Briefing Prompt

> Pass this entire document as the system/context prompt to the next agent.
> It contains every architectural decision, feature spec, schema, API contract,
> and implementation rule needed to build the project from scratch.

---

## 1. Project Identity

**Project Name:** DMRC Vendor Registration Portal
**Client:** Delhi Metro Rail Corporation (DMRC)
**Purpose:** A secure web portal where external vendors register, submit categorised
application forms (Civil / Electrical / Architecture), and track their approval status.

---

## 2. Final Agreed Tech Stack

| Layer | Technology | Version / Notes |
|---|---|---|
| Framework | Next.js (App Router) | v14+ |
| Language | TypeScript | Strict mode enabled |
| UI Components | shadcn/ui | Latest — do NOT use MUI or Chakra |
| Styling | Tailwind CSS | v3 utility-first |
| Database | PostgreSQL | Hosted on Neon (serverless) |
| ORM | Prisma | v5+ with Prisma Client |
| Auth | NextAuth.js | v5 (beta) with Prisma Adapter |
| Password Hashing | bcryptjs | Salt rounds: 12 |
| Form Validation | React Hook Form + Zod | End-to-end type-safe |
| Deployment | Vercel (app) + Neon (DB) | Single Vercel project |

**Architecture rule:** There is NO separate Express/Node backend. All API logic lives
inside Next.js API routes at `app/api/...`. Frontend and backend share the same
TypeScript types via the `types/` folder.

---

## 3. Feature Requirements (Complete List)

### 3.1 Authentication
- Registration page: collects PAN Card number, Password, Confirm Password ONLY
- PAN card format validation: regex `/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/`
- Password and Confirm Password must match — validated client-side via Zod refine()
- Password hashed with bcryptjs before storing — NEVER store plaintext
- Login page: PAN Card + Password, verified against DB via NextAuth credentials provider
- Session managed via JWT (NextAuth)
- On login, vendor is redirected to `/dashboard`
- Route protection via `middleware.ts` — unauthenticated users redirected to `/login`

### 3.2 Vendor Application Form
- Accessible at `/dashboard/apply` after login
- Three tabs using shadcn `<Tabs>` component: **Civil**, **Electrical**, **Architecture**
- Vendor selects ONE category and fills that form only
- Each form has a shared base section + category-specific fields
- Form fields for each category are to be finalised separately — agent must await confirmation before building form field components
- Multi-step UX with a progress bar (Step 1: Company Info → Step 2: Category Fields → Step 3: Review & Submit)
- Client-side Zod validation on every field before submission
- On submit: POST to `/api/vendor/apply`
- A vendor can only submit ONE application. If already submitted, show read-only view

### 3.3 Vendor Dashboard (Status View)
- Accessible at `/dashboard`
- Shows submitted form data in a clean read-only card layout
- Shows current status as a shadcn `<Badge>`:
  - `PENDING` → amber badge
  - `APPROVED` → green badge
  - `REJECTED` → red badge
- If no application submitted yet, show a CTA button to `/dashboard/apply`

---

## 4. Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(cuid())
  panCard     String   @unique
  password    String
  createdAt   DateTime @default(now())
  application VendorApplication?
}

model VendorApplication {
  id          String      @id @default(cuid())
  userId      String      @unique
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  category    Category
  status      Status      @default(PENDING)
  companyName String
  formData    Json
  submittedAt DateTime    @default(now())
}

enum Category {
  CIVIL
  ELECTRICAL
  ARCHITECTURE
}

enum Status {
  PENDING
  APPROVED
  REJECTED
}
```

**Key design decision:** Category-specific fields are stored in the `formData Json` column.
Fixed relational fields (companyName, status, category) are proper columns.
This gives relational integrity where needed and flexibility for the varying form fields.

---

## 5. API Routes Contract

### POST `/api/register`
- Body: `{ panCard, password }`
- Validates PAN format, hashes password, creates User in DB
- Returns: `201 { message: "Registration successful" }`
- Errors: `409` if PAN card already exists

### POST `/api/auth/[...nextauth]`
- Handled entirely by NextAuth — do not modify
- Credentials provider checks panCard + bcrypt.compare(password, hash)
- Session contains: `{ id, panCard }`

### POST `/api/vendor/apply`
- Auth: valid session required
- Body: `{ category, companyName, formData }`
- Enforces one-application-per-user
- Returns: `201 { application }`
- Errors: `409` if already applied

### GET `/api/vendor/status`
- Auth: valid session required
- Returns own VendorApplication record
- Returns: `200 { application }` or `404` if none

---

## 6. Environment Variables Required

```bash
# .env.local
DATABASE_URL="postgresql://..."           # Neon connection string
NEXTAUTH_SECRET="your-secret-here"        # Random 32-char string
NEXTAUTH_URL="http://localhost:3000"      # Change to prod URL on deploy
```

---

## 7. UI & Design Rules

- Color theme: DMRC brand — primary blue `#003F87`, accent gold `#F5A623`
- Header must display DMRC logo text + "Vendor Registration Portal" subtitle
- All forms use shadcn `<Form>`, `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormMessage>`
- Validation errors appear inline below each field (never toast for field errors)
- Toast notifications (shadcn `<Sonner>`) for: successful submission, successful login, API errors
- Status badges must use exact colours: Pending=amber, Approved=green, Rejected=red
- All pages must be responsive — mobile-first
- Use shadcn `<Skeleton>` for all loading states (no spinners)
- Form multi-step progress: use a numeric step indicator (Step 1 of 3) at the top

---

## 8. Security Rules (Non-Negotiable)

1. NEVER return password hash in any API response
2. ALL `/api/vendor/*` routes must verify session exists and use `session.user.id` to
   scope DB queries — a vendor must NEVER be able to read another vendor's data
3. PAN card and GST inputs must be sanitised (strip whitespace, uppercase) before DB write
4. Rate-limit `/api/register` and `/api/auth` routes (max 10 req/min per IP)
5. Confirm Password field is validated client-side only via Zod refine() — never sent to the server

---

## 9. Prisma Seed File

The seed must create:
- 3 test VENDOR users (one per category), each with only panCard + hashed password
- Use PAN cards: `ABCDE1234F`, `FGHIJ5678K`, `LMNOP9012Q` for the three test vendors
- Applications with statuses: one PENDING, one APPROVED, one REJECTED

Run with: `npx prisma db seed`

---

## 10. Build Order (Follow This Sequence)

Build in this exact sequence to avoid dependency issues:

1. Prisma schema → run migration → confirm DB connected
2. Prisma client singleton + NextAuth config
3. NextAuth route handler
4. Registration API route (PAN + password only)
5. Register page UI + Login page UI
6. Route protection middleware
7. Zod validators for auth and all form types
8. Vendor application submit + status API routes
9. Vendor dashboard page
10. Seed file
11. Final: responsive pass, error states, accessibility

> Note: Form field components are to be built only after the final form field
> structure has been confirmed. Do not scaffold form fields based on assumptions.

---

## 11. What NOT To Do

- Do NOT use MongoDB or any other database — it must be PostgreSQL via Neon
- Do NOT use a separate Express server — all backend logic stays in Next.js API routes
- Do NOT use any UI library other than shadcn/ui + Tailwind (no MUI, AntD, Bootstrap)
- Do NOT store passwords in plaintext — always bcryptjs
- Do NOT expose the session user's password hash in client components
- Do NOT skip Zod validation — every API route must validate its request body
- Do NOT use `any` TypeScript type — strict typing throughout
- Do NOT use `pages/` router — this project uses App Router exclusively
- Do NOT build form field components until the final field structure is confirmed

---

## 12. Project Summary (One Paragraph)

Build a full-stack Next.js 14 (App Router, TypeScript) web portal for DMRC vendor
registration. Vendors register using only their PAN card number and password (no name
or email required), log in, and fill one of three categorised application forms
(Civil,Electrical or Architecture). Their submission is stored in a PostgreSQL database
(via Neon + Prisma ORM) and they can track its approval status (Pending / Approved /
Rejected) on their dashboard. The entire UI is built with shadcn/ui and Tailwind CSS
following DMRC's blue and gold brand colours. Authentication is handled by NextAuth.js
v5 with the Prisma adapter, using PAN card as the unique login identifier. The project
is deployed on Vercel with the database on Neon's free tier. Admin panel, email
notifications, and final form field structure are out of scope for this phase.

---

*End of briefing. The agent receiving this prompt has everything needed to build
the DMRC Vendor Portal from scratch without any additional context.*
