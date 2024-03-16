-- CreateTable
CREATE TABLE `User` (
    `address` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `nonce` VARCHAR(191) NOT NULL,
    `bio` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_address_key`(`address`),
    PRIMARY KEY (`address`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IpfsFile` (
    `hash` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `userAddress` VARCHAR(191) NULL,

    UNIQUE INDEX `IpfsFile_hash_key`(`hash`),
    PRIMARY KEY (`hash`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `IpfsFile` ADD CONSTRAINT `IpfsFile_userAddress_fkey` FOREIGN KEY (`userAddress`) REFERENCES `User`(`address`) ON DELETE SET NULL ON UPDATE CASCADE;
