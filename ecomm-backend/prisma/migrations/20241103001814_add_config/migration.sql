/*
  Warnings:

  - You are about to drop the `ABTest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ABTestToProductVariant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ABTest";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ABTestToProductVariant";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "AbConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enabled" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "AbTest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "configId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "purchases" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "productBlob" TEXT NOT NULL,
    CONSTRAINT "AbTest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AbTest_configId_fkey" FOREIGN KEY ("configId") REFERENCES "AbConfig" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_AbTestToProductVariant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AbTestToProductVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "AbTest" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AbTestToProductVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductVariant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_AbTestToProductVariant_AB_unique" ON "_AbTestToProductVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_AbTestToProductVariant_B_index" ON "_AbTestToProductVariant"("B");
