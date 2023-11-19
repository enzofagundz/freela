-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserProjectRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "UserProjectRelation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserProjectRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserProjectRelation" ("id", "projectId", "userId") SELECT "id", "projectId", "userId" FROM "UserProjectRelation";
DROP TABLE "UserProjectRelation";
ALTER TABLE "new_UserProjectRelation" RENAME TO "UserProjectRelation";
CREATE TABLE "new_UserCategoryRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "UserCategoryRelation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserCategoryRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserCategoryRelation" ("categoryId", "id", "userId") SELECT "categoryId", "id", "userId" FROM "UserCategoryRelation";
DROP TABLE "UserCategoryRelation";
ALTER TABLE "new_UserCategoryRelation" RENAME TO "UserCategoryRelation";
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL NOT NULL,
    "status" TEXT NOT NULL,
    "deliveryDate" DATETIME NOT NULL,
    "customerId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "Project_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Project_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("categoryId", "customerId", "deliveryDate", "description", "id", "name", "price", "status") SELECT "categoryId", "customerId", "deliveryDate", "description", "id", "name", "price", "status" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE TABLE "new_UserCustomerRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    CONSTRAINT "UserCustomerRelation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserCustomerRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserCustomerRelation" ("customerId", "id", "userId") SELECT "customerId", "id", "userId" FROM "UserCustomerRelation";
DROP TABLE "UserCustomerRelation";
ALTER TABLE "new_UserCustomerRelation" RENAME TO "UserCustomerRelation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
