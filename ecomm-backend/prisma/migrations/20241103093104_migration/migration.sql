-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AbTest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "configId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "defaultConversions" INTEGER NOT NULL DEFAULT 0,
    "defaultVisits" INTEGER NOT NULL DEFAULT 0,
    "productBlob" TEXT NOT NULL,
    CONSTRAINT "AbTest_configId_fkey" FOREIGN KEY ("configId") REFERENCES "ProductAbConfig" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AbTest" ("configId", "description", "id", "name", "productBlob", "status") SELECT "configId", "description", "id", "name", "productBlob", "status" FROM "AbTest";
DROP TABLE "AbTest";
ALTER TABLE "new_AbTest" RENAME TO "AbTest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
