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
| Auth | NextAuth.js | v5 (beta) with Credentials provider + JWT (no PrismaAdapter) |
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
- Vendor selects a category and fills that form
- A vendor can submit **multiple applications** across categories
- **Limit:** Max 3 applications in `UNDER_REVIEW` status per category per vendor.
  New submissions are allowed only when fewer than 3 are under review in that category.
- Each form has a shared base section + category-specific fields
- Form fields for each category are to be finalised separately — agent must await confirmation before building form field components
- **Save-and-resume:** Applications start as `DRAFT`. Vendors can save partial progress
  and return later to complete and submit. Only `SUBMITTED` applications enter the review queue.
- Multi-step UX with a progress bar (Step 1: Company Info → Step 2: Category Fields → Step 3: Document Upload → Step 4: Review & Submit)
- **File uploads:** Vendors can attach supporting documents (e.g. certificates, registrations)
  during the application form phase. Files are stored and linked via the `ApplicationDocument` model.
- Client-side Zod validation on every field before submission
- On submit: POST to `/api/applications`
- On save draft: PUT to `/api/applications/[id]`

### 3.3 Vendor Dashboard (Status View)
- Accessible at `/dashboard`
- Shows **all** submitted and draft applications in a list/card layout
- Each application card shows: category, company name, status badge, submission date
- Shows current status as a shadcn `<Badge>`:
  - `DRAFT` → gray badge
  - `SUBMITTED` → blue badge
  - `UNDER_REVIEW` → amber badge
  - `APPROVED` → green badge
  - `REJECTED` → red badge
- Clicking an application opens a read-only detail view (with `remarks` if reviewed)
- If no applications exist, show a CTA button to `/dashboard/apply`
- Show a "New Application" button if the vendor is eligible to submit more

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

enum UserRole {
  VENDOR
  ADMIN
}

enum VendorCategory {
  CIVIL
  ELECTRICAL
  ARCHITECTURE
}

enum ApplicationStatus {
  DRAFT
  SUBMITTED
  UNDER_REVIEW
  APPROVED
  REJECTED
}

model User {
  id           String              @id @default(cuid())
  panCard      String              @unique
  password     String
  role         UserRole            @default(VENDOR)
  createdAt    DateTime            @default(now())
  updatedAt    DateTime            @updatedAt

  applications VendorApplication[]
}

model VendorApplication {
  id           String              @id @default(cuid())
  userId       String
  category     VendorCategory
  status       ApplicationStatus   @default(DRAFT)
  companyName  String?
  formData     Json?
  remarks      String?
  submittedAt  DateTime?
  createdAt    DateTime            @default(now())
  updatedAt    DateTime            @updatedAt

  user         User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  documents    ApplicationDocument[]

  @@index([userId])
  @@index([status])
  @@index([category])
  @@index([userId, category, status])
}

model ApplicationDocument {
  id            String            @id @default(cuid())
  applicationId String
  documentType  String
  fileName      String
  fileUrl       String
  mimeType      String?
  sizeBytes     Int?
  createdAt     DateTime          @default(now())

  application   VendorApplication @relation(fields: [applicationId], references: [id], onDelete: Cascade)

  @@index([applicationId])
}
```

**Key design decisions:**
- **`User 1:N VendorApplication`** — a vendor can submit multiple applications across
  categories. The max-3-under-review-per-category rule is enforced at the API layer,
  not via database constraints (since it depends on status, not just existence).
- `companyName` and `formData` are **nullable** to support `DRAFT` status (partial saves).
- `submittedAt` is **nullable** — only set when the vendor actually submits (not on draft save).
- Category-specific fields are stored in the `formData Json` column.
  Fixed relational fields (companyName, status, category) are proper columns.
- `ApplicationDocument` stores file metadata for uploads attached during the form phase.
  Actual files should be stored in an object store (e.g. Vercel Blob, S3) with `fileUrl`
  pointing to the stored location.
- `remarks` allows admins to provide feedback when approving/rejecting applications.
- `updatedAt` auto-tracks when a record is modified (e.g. status change, draft update).
- Composite index `[userId, category, status]` enables fast enforcement of the
  max-3-under-review business rule.
- **No `@auth/prisma-adapter`** — since we use Credentials provider + JWT sessions
  (not OAuth), the PrismaAdapter is unnecessary. Prisma is used directly in the
  NextAuth `authorize()` callback.

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
- Session contains: `{ id, panCard, role }`

### POST `/api/applications`
- Auth: valid session required
- Body: `{ category, companyName?, formData? }`
- Creates a new application in `DRAFT` status
- Enforces max-3-under-review per category: rejects if vendor already has 3 applications
  with status `UNDER_REVIEW` in the requested category
- Returns: `201 { application }`
- Errors: `403` if limit exceeded

### PUT `/api/applications/[id]`
- Auth: valid session required (must own the application)
- Body: `{ companyName?, formData?, status? }`
- Used for: saving draft progress, or submitting (status change from `DRAFT` → `SUBMITTED`)
- Only `DRAFT` applications can be edited
- Returns: `200 { application }`
- Errors: `403` if not owner, `400` if application is not in DRAFT status

### GET `/api/applications`
- Auth: valid session required
- Returns all VendorApplication records for the logged-in user
- Includes: status, category, remarks, submittedAt, updatedAt
- Returns: `200 { applications: [...] }`

### GET `/api/applications/[id]`
- Auth: valid session required (must own the application)
- Returns a single application with full detail including documents
- Returns: `200 { application }` or `404` if none

### POST `/api/applications/[id]/documents`
- Auth: valid session required (must own the application)
- Body: multipart form data with file
- Stores file and creates an `ApplicationDocument` record
- Only allowed on `DRAFT` applications
- Returns: `201 { document }`

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
- Status badges must use exact colours:
  - Draft=gray, Submitted=blue, Under Review=amber, Approved=green, Rejected=red
- All pages must be responsive — mobile-first
- Use shadcn `<Skeleton>` for all loading states (no spinners)
- Form multi-step progress: use a numeric step indicator (Step 1 of 4) at the top

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
- 1 test ADMIN user with panCard + hashed password
- Use PAN cards: `ABCDE1234F`, `FGHIJ5678K`, `LMNOP9012Q` for the three test vendors,
  and `ADMIN1234A` for the admin
- Multiple applications per user, with varying statuses:
  - User 1: one SUBMITTED, one DRAFT
  - User 2: one APPROVED, one UNDER_REVIEW
  - User 3: one REJECTED (with remarks), one DRAFT

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

Build a full-stack Next.js (App Router, TypeScript) web portal for DMRC vendor
registration. Vendors register using only their PAN card number and password (no name
or email required), log in, and fill categorised application forms
(Civil, Electrical, or Architecture). A vendor can submit multiple applications across
categories, with a maximum of 3 under review per category at any time. Applications
support a save-and-resume workflow (DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED/REJECTED).
Vendors can attach supporting documents during the form phase. Submissions are stored
in a PostgreSQL database (via Neon + Prisma ORM) and vendors can track all their
application statuses on their dashboard. The entire UI is built with shadcn/ui and
Tailwind CSS following DMRC's blue and gold brand colours. Authentication is handled
by NextAuth.js v5 with Credentials provider and JWT sessions, using PAN card as the
unique login identifier. The project is deployed on Vercel with the database on Neon's
free tier. Admin panel, email notifications, and final form field structure are out
of scope for this phase.

---

*End of briefing. The agent receiving this prompt has everything needed to build
the DMRC Vendor Portal from scratch without any additional context.*
