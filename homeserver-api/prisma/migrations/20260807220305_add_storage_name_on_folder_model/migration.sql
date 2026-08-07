/*
  Warnings:

  - A unique constraint covering the columns `[storage_name]` on the table `folders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code_hash]` on the table `recover_password` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `storage_name` to the `folders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "folders" ADD COLUMN     "storage_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "folders_storage_name_key" ON "folders"("storage_name");

-- CreateIndex
CREATE UNIQUE INDEX "recover_password_code_hash_key" ON "recover_password"("code_hash");
