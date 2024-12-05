/*
  Warnings:

  - You are about to drop the column `purchases` on the `AbTest` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_ProductVariantToSession" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ProductVariantToSession_A_fkey" FOREIGN KEY ("A") REFERENCES "ProductVariant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProductVariantToSession_B_fkey" FOREIGN KEY ("B") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AbTest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "configId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "productBlob" TEXT NOT NULL,
    CONSTRAINT "AbTest_configId_fkey" FOREIGN KEY ("configId") REFERENCES "ProductAbConfig" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AbTest" ("configId", "description", "id", "name", "productBlob", "status") SELECT "configId", "description", "id", "name", "productBlob", "status" FROM "AbTest";
DROP TABLE "AbTest";
ALTER TABLE "new_AbTest" RENAME TO "AbTest";
CREATE TABLE "new_ProductVariant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "abTestId" INTEGER NOT NULL,
    "changes" TEXT NOT NULL,
    "visits" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductVariant_abTestId_fkey" FOREIGN KEY ("abTestId") REFERENCES "AbTest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductVariant" ("abTestId", "changes", "id", "productId") SELECT "abTestId", "changes", "id", "productId" FROM "ProductVariant";
DROP TABLE "ProductVariant";
ALTER TABLE "new_ProductVariant" RENAME TO "ProductVariant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Session_id_key" ON "Session"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductVariantToSession_AB_unique" ON "_ProductVariantToSession"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductVariantToSession_B_index" ON "_ProductVariantToSession"("B");
