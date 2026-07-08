# DMRC Vendor Registration Portal

Welcome to the **Delhi Metro Rail Corporation (DMRC) Vendor Registration Portal**. This is a modern, full-stack web application designed to streamline the onboarding and registration process for new and existing vendors working with DMRC across various disciplines (Civil, Electrical, and Architecture).

---

## ✨ Features

- **Secure Vendor Authentication:** Custom authentication flow using NextAuth.js, allowing vendors to securely log in and register using their PAN Card credentials.
- **Dynamic Vendor Dashboard:** A clean, glassmorphic dashboard where vendors can manage their draft applications, view submitted forms, and check review statuses.
- **Complex Application Forms:** Highly dynamic, multi-step forms built with `react-hook-form` and `zod`. Features category-specific routing (Civil vs Electrical vs Architecture fields) with seamless file upload capabilities.
- **Modern UI/UX:** Built using Tailwind CSS and Shadcn UI to ensure a premium, accessible, and highly responsive user experience across all devices.
- **Type-Safe Backend:** Uses Next.js API routes and Prisma ORM to ensure complete end-to-end type safety when reading and writing to the database.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/UI (Radix Primitives)
- **Database ORM:** Prisma
- **Authentication:** NextAuth.js (Auth.js) v5
- **Form Handling:** react-hook-form + Zod

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Installation
Clone the repository and install the dependencies:
```bash
# Navigate into the project folder
cd dmrc-portal

# Install NPM dependencies
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root of the `dmrc-portal` directory and add your environment variables. You will need a database connection string (PostgreSQL/MySQL) and a NextAuth secret.
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dmrc_db?schema=public"
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup
Push the Prisma schema to your database to create the necessary tables, and generate the local Prisma Client:
```bash
npx prisma generate
npx prisma db push
```

### 4. Run the Development Server
Start the local server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📁 Project Structure Highlights

- `/app`: Contains all the Next.js App Router pages (`/login`, `/register`, `/dashboard`) and backend API endpoints (`/api/...`).
- `/components`: Contains all reusable React components.
  - `/components/auth`: Login and Registration forms.
  - `/components/forms`: The massive category-specific application fields (Civil, Electrical, Architecture).
  - `/components/ui`: Shadcn primitive UI elements (Buttons, Inputs, Dialogs).
- `/prisma`: Contains `schema.prisma`, the source of truth for the database architecture.
- `/public`: Static assets including the DMRC logos and background images.

---

## 📄 License
This project is proprietary and confidential. Designed for the Delhi Metro Rail Corporation.
