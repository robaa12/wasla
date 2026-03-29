-- CreateTable
CREATE TABLE "short_urls" (
    "id" TEXT NOT NULL,
    "longUrl" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "short_urls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "short_urls_createdAt_idx" ON "short_urls"("createdAt");
