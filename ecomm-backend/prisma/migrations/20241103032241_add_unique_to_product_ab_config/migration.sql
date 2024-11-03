/*
  Warnings:

  - A unique constraint covering the columns `[productId,type]` on the table `ProductAbConfig` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductAbConfig_productId_type_key" ON "ProductAbConfig"("productId", "type");
