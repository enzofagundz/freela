/*
  Warnings:

  - You are about to drop the `ProjectCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectCategoryRelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectCategoryRelation" DROP CONSTRAINT "ProjectCategoryRelation_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectCategoryRelation" DROP CONSTRAINT "ProjectCategoryRelation_projectId_fkey";

-- DropTable
DROP TABLE "ProjectCategory";

-- DropTable
DROP TABLE "ProjectCategoryRelation";
