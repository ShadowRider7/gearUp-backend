/*
  Warnings:

  - You are about to drop the column `transactionId` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripePaymentIntentId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripePaymentIntentId` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Made the column `paidAt` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "payments_transactionId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "transactionId",
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripePaymentIntentId" TEXT NOT NULL,
ALTER COLUMN "method" SET DEFAULT 'STRIPE',
ALTER COLUMN "status" SET DEFAULT 'COMPLETED',
ALTER COLUMN "paidAt" SET NOT NULL,
ALTER COLUMN "paidAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripePaymentIntentId_key" ON "payments"("stripePaymentIntentId");
