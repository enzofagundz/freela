-- CreateTable
CREATE TABLE "TempUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "token" INTEGER NOT NULL,
    "expiresAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TempUser_email_key" ON "TempUser"("email");
