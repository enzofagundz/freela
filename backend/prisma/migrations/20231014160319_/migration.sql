/*
  Warnings:

  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomerProjectRelation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCostumerRelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CustomerProjectRelation" DROP CONSTRAINT "CustomerProjectRelation_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerProjectRelation" DROP CONSTRAINT "CustomerProjectRelation_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UserCostumerRelation" DROP CONSTRAINT "UserCostumerRelation_customerId_fkey";

-- DropForeignKey
ALTER TABLE "UserCostumerRelation" DROP CONSTRAINT "UserCostumerRelation_userId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "customerEmail" TEXT,
ADD COLUMN     "customerName" TEXT;

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "CustomerProjectRelation";

-- DropTable
DROP TABLE "UserCostumerRelation";
