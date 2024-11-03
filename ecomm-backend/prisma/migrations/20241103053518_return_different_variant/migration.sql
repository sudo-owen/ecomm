-- CreateTable
CREATE TABLE "_AbTestToSession" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_AbTestToSession_A_fkey" FOREIGN KEY ("A") REFERENCES "AbTest" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AbTestToSession_B_fkey" FOREIGN KEY ("B") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_AbTestToSession_AB_unique" ON "_AbTestToSession"("A", "B");

-- CreateIndex
CREATE INDEX "_AbTestToSession_B_index" ON "_AbTestToSession"("B");
