/*
  Warnings:

  - A unique constraint covering the columns `[studentCardId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Student_studentCardId_key" ON "Student"("studentCardId");
