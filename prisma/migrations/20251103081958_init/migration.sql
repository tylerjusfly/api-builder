-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "JamSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "events" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "_JamSessionToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_JamSessionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "JamSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_JamSessionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_JamSessionToUser_AB_unique" ON "_JamSessionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_JamSessionToUser_B_index" ON "_JamSessionToUser"("B");
