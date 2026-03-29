-- CreateTable
CREATE TABLE "click_events" (
    "id" TEXT NOT NULL,
    "shortId" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "device" TEXT,
    "country" TEXT,
    "city" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "click_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "click_aggregates" (
    "id" TEXT NOT NULL,
    "shortId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "totalClicks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "click_aggregates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "click_events_shortId_idx" ON "click_events"("shortId");

-- CreateIndex
CREATE INDEX "click_events_shortId_timestamp_idx" ON "click_events"("shortId", "timestamp");

-- CreateIndex
CREATE INDEX "click_events_country_idx" ON "click_events"("country");

-- CreateIndex
CREATE INDEX "click_events_timestamp_idx" ON "click_events"("timestamp");

-- CreateIndex
CREATE INDEX "click_aggregates_shortId_idx" ON "click_aggregates"("shortId");

-- CreateIndex
CREATE UNIQUE INDEX "click_aggregates_shortId_date_key" ON "click_aggregates"("shortId", "date");
