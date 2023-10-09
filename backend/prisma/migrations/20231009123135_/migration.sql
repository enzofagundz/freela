/*
  Warnings:

  - Changed the type of `deliveryDate` on the `Project` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `token` on the `TempUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `expiresAt` on the `TempUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "deliveryDate",
ADD COLUMN     "deliveryDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TempUser" DROP COLUMN "token",
ADD COLUMN     "token" INTEGER NOT NULL,
DROP COLUMN "expiresAt",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;
