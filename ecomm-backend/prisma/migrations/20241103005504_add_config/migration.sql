/*
  Warnings:

  - You are about to drop the `_AbTestToProductVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `productId` on the `AbTest` table. All the data in the column will be lost.
  - Added the required column `productId` to the `AbConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `AbConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `abTestId` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_AbTestToProductVariant_B_index";

-- DropIndex
DROP INDEX "_AbTestToProductVariant_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_AbTestToProductVariant";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AbConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enabled" BOOLEAN NOT NULL,
    "productId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "AbConfig_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AbConfig" ("enabled", "id") SELECT "enabled", "id" FROM "AbConfig";
DROP TABLE "AbConfig";
ALTER TABLE "new_AbConfig" RENAME TO "AbConfig";
CREATE TABLE "new_AbTest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "configId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "purchases" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "productBlob" TEXT NOT NULL,
    CONSTRAINT "AbTest_configId_fkey" FOREIGN KEY ("configId") REFERENCES "AbConfig" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AbTest" ("configId", "description", "id", "name", "productBlob", "purchases", "status") SELECT "configId", "description", "id", "name", "productBlob", "purchases", "status" FROM "AbTest";
DROP TABLE "AbTest";
ALTER TABLE "new_AbTest" RENAME TO "AbTest";
CREATE TABLE "new_ProductVariant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "abTestId" INTEGER NOT NULL,
    "changes" TEXT NOT NULL,
    CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductVariant_abTestId_fkey" FOREIGN KEY ("abTestId") REFERENCES "AbTest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductVariant" ("changes", "id", "productId") SELECT "changes", "id", "productId" FROM "ProductVariant";
DROP TABLE "ProductVariant";
ALTER TABLE "new_ProductVariant" RENAME TO "ProductVariant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
