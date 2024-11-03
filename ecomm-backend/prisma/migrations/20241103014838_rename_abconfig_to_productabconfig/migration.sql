/*
  Warnings:

  - You are about to drop the `AbConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AbConfig";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ProductAbConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enabled" BOOLEAN NOT NULL,
    "productId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "ProductAbConfig_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AbTest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "configId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "purchases" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "productBlob" TEXT NOT NULL,
    CONSTRAINT "AbTest_configId_fkey" FOREIGN KEY ("configId") REFERENCES "ProductAbConfig" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AbTest" ("configId", "description", "id", "name", "productBlob", "purchases", "status") SELECT "configId", "description", "id", "name", "productBlob", "purchases", "status" FROM "AbTest";
DROP TABLE "AbTest";
ALTER TABLE "new_AbTest" RENAME TO "AbTest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
