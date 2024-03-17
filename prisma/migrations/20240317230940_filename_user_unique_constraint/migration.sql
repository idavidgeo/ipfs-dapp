/*
  Warnings:

  - A unique constraint covering the columns `[name,userAddress]` on the table `IpfsFile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `IpfsFile_name_userAddress_key` ON `IpfsFile`(`name`, `userAddress`);
