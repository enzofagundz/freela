-- CreateTable
CREATE TABLE "UserCustomerRelation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,

    CONSTRAINT "UserCustomerRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TempUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "token" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TempUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCategoryRelation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "UserCategoryRelation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TempUser_email_key" ON "TempUser"("email");

-- AddForeignKey
ALTER TABLE "UserCustomerRelation" ADD CONSTRAINT "UserCustomerRelation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCustomerRelation" ADD CONSTRAINT "UserCustomerRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCategoryRelation" ADD CONSTRAINT "UserCategoryRelation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCategoryRelation" ADD CONSTRAINT "UserCategoryRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
