/*
  Warnings:

  - Added the required column `verified` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `verified` BOOLEAN NOT NULL,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `bio` VARCHAR(191) NULL;
