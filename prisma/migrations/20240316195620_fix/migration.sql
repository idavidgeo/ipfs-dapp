/*
  Warnings:

  - Made the column `userAddress` on table `IpfsFile` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `IpfsFile` DROP FOREIGN KEY `IpfsFile_userAddress_fkey`;

-- AlterTable
ALTER TABLE `IpfsFile` MODIFY `userAddress` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `IpfsFile` ADD CONSTRAINT `IpfsFile_userAddress_fkey` FOREIGN KEY (`userAddress`) REFERENCES `User`(`address`) ON DELETE RESTRICT ON UPDATE CASCADE;
