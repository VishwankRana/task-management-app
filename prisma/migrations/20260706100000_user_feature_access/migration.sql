-- AlterTable
ALTER TABLE `User` ADD COLUMN `calendarEnabled` BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE `User` ADD COLUMN `analyticsEnabled` BOOLEAN NOT NULL DEFAULT true;
