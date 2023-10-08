-- CreateTable
CREATE TABLE "TempUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TempUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TempUser_email_key" ON "TempUser"("email");
