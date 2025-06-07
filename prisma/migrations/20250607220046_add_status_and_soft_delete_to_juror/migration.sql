-- CreateEnum
CREATE TYPE "JurorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DELETED', 'PENDING', 'REJECTED', 'SELECTED');

-- AlterTable
ALTER TABLE "Juror" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "status" "JurorStatus" NOT NULL DEFAULT 'ACTIVE';
