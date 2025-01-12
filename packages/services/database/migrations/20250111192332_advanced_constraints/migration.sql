/*
  Warnings:

  - You are about to alter the column `title` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "title" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "content" SET DEFAULT '';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);
