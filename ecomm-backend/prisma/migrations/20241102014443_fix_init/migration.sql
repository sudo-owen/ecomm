/*
  Warnings:

  - You are about to drop the column `variantIds` on the `ABTest` table. All the data in the column will be lost.
  - You are about to drop the column `variationIndex` on the `ABTest` table. All the data in the column will be lost.
  - You are about to drop the column `variationType` on the `ABTest` table. All the data in the column will be lost.
  - Added the required column `productBlob` to the `ABTest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_ABTestToProductVariant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ABTestToProductVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "ABTest" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ABTestToProductVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductVariant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ABTest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "purchases" INTEGER NOT NULL,
    "productBlob" TEXT NOT NULL,
    CONSTRAINT "ABTest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ABTest" ("description", "id", "name", "productId", "purchases") SELECT "description", "id", "name", "productId", "purchases" FROM "ABTest";
DROP TABLE "ABTest";
ALTER TABLE "new_ABTest" RENAME TO "ABTest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_ABTestToProductVariant_AB_unique" ON "_ABTestToProductVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_ABTestToProductVariant_B_index" ON "_ABTestToProductVariant"("B");
