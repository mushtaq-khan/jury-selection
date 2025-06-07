-- CreateEnum
CREATE TYPE "CaseType" AS ENUM ('CIVIL', 'CRIMINAL');

-- CreateTable
CREATE TABLE "Juror" (
    "id" SERIAL NOT NULL,
    "jurorNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "homeAddress" TEXT NOT NULL,
    "mailingAddress" TEXT NOT NULL,
    "tdlNumber" TEXT NOT NULL,
    "homePhone" TEXT NOT NULL,
    "countyOfResidence" TEXT NOT NULL,
    "criminalCaseExp" BOOLEAN NOT NULL DEFAULT false,
    "accidentalInjury" BOOLEAN NOT NULL DEFAULT false,
    "education" TEXT NOT NULL,
    "civilJuryService" BOOLEAN NOT NULL DEFAULT false,
    "criminalJuryService" BOOLEAN NOT NULL DEFAULT false,
    "usCitizen" BOOLEAN NOT NULL DEFAULT false,
    "occupation" TEXT,
    "workPhone" TEXT,
    "maritalStatus" TEXT NOT NULL,
    "spouse" TEXT,
    "employer" TEXT,
    "lengthOfEmployment" TEXT,
    "numberOfChildren" INTEGER NOT NULL DEFAULT 0,
    "panelPosition" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "caseId" INTEGER,

    CONSTRAINT "Juror_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" SERIAL NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "caseType" "CaseType" NOT NULL,
    "caseName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "idealJurorTraits" TEXT NOT NULL,
    "caseQuestions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Juror_jurorNumber_key" ON "Juror"("jurorNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Juror_tdlNumber_key" ON "Juror"("tdlNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Juror_caseId_key" ON "Juror"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "Case_caseNumber_key" ON "Case"("caseNumber");

-- AddForeignKey
ALTER TABLE "Juror" ADD CONSTRAINT "Juror_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
