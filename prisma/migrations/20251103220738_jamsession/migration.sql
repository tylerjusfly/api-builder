-- CreateTable
CREATE TABLE "JamSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "events" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roomId" TEXT NOT NULL,
    CONSTRAINT "JamSession_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("roomId") ON DELETE RESTRICT ON UPDATE CASCADE
);
