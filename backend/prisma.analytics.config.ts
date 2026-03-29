import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/analytics-schema.prisma",
  migrations: {
    path: "prisma/analytics-migrations",
  },
  datasource: {
    url: process.env["ANALYTICS_DATABASE_URL"],
  },
});
