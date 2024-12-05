-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductAbConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enabled" BOOLEAN NOT NULL,
    "productId" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'description',
    CONSTRAINT "ProductAbConfig_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductAbConfig" ("enabled", "id", "productId", "type") SELECT "enabled", "id", "productId", "type" FROM "ProductAbConfig";
DROP TABLE "ProductAbConfig";
ALTER TABLE "new_ProductAbConfig" RENAME TO "ProductAbConfig";
CREATE UNIQUE INDEX "ProductAbConfig_productId_type_key" ON "ProductAbConfig"("productId", "type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
