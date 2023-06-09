/*
  Warnings:

  - You are about to drop the column `picture` on the `Contact` table. All the data in the column will be lost.
  - Added the required column `pictureName` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pictureUrl` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "picture",
ADD COLUMN     "pictureName" TEXT NOT NULL,
ADD COLUMN     "pictureUrl" TEXT NOT NULL;
