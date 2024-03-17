/*
  Warnings:

  - The primary key for the `IpfsFile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `_UserIpfsFiles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id` to the `IpfsFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAddress` to the `IpfsFile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_UserIpfsFiles` DROP FOREIGN KEY `_UserIpfsFiles_A_fkey`;

-- DropForeignKey
ALTER TABLE `_UserIpfsFiles` DROP FOREIGN KEY `_UserIpfsFiles_B_fkey`;

-- DropIndex
DROP INDEX `IpfsFile_hash_key` ON `IpfsFile`;

-- AlterTable
ALTER TABLE `IpfsFile` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `userAddress` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `_UserIpfsFiles`;

-- AddForeignKey
ALTER TABLE `IpfsFile` ADD CONSTRAINT `IpfsFile_userAddress_fkey` FOREIGN KEY (`userAddress`) REFERENCES `User`(`address`) ON DELETE RESTRICT ON UPDATE CASCADE;
