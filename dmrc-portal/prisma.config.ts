import dotenv from "dotenv";
import path from "path";
import { defineConfig, env } from "prisma/config";

// Load .env.local (Next.js convention) instead of default .env
dotenv.config({ path: path.resolve(__dirname, ".env.local") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
