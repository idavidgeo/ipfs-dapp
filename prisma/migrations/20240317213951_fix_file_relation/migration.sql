/*
  Warnings:

  - You are about to drop the column `userAddress` on the `IpfsFile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `IpfsFile` DROP FOREIGN KEY `IpfsFile_userAddress_fkey`;

-- AlterTable
ALTER TABLE `IpfsFile` DROP COLUMN `userAddress`;

-- CreateTable
CREATE TABLE `_UserIpfsFiles` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_UserIpfsFiles_AB_unique`(`A`, `B`),
    INDEX `_UserIpfsFiles_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_UserIpfsFiles` ADD CONSTRAINT `_UserIpfsFiles_A_fkey` FOREIGN KEY (`A`) REFERENCES `IpfsFile`(`hash`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserIpfsFiles` ADD CONSTRAINT `_UserIpfsFiles_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`address`) ON DELETE CASCADE ON UPDATE CASCADE;
