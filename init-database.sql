-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'GESTIONNAIRE', 'TRESORIER', 'SECRETAIRE');

-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('HOMME', 'FEMME');

-- CreateEnum
CREATE TYPE "Categorie" AS ENUM ('ANCIEN', 'DIACRE', 'FIDELE');

-- CreateEnum
CREATE TYPE "SituationMatrimoniale" AS ENUM ('CELIBATAIRE', 'MARIE', 'VEUF', 'DIVORCE');

-- CreateEnum
CREATE TYPE "TypeVersement" AS ENUM ('DIME', 'DETTE_DIME', 'DETTE_COTISATION', 'OFFRANDE_CONSTRUCTION');

-- CreateEnum
CREATE TYPE "TypeCotisation" AS ENUM ('RECOLTE', 'AUTRES_RECETTES');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT,
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'SECRETAIRE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "paroissiens" (
    "id" TEXT NOT NULL,
    "matricule" TEXT NOT NULL,
    "newMatricule" TEXT,
    "name" TEXT NOT NULL,
    "genre" "Genre" NOT NULL DEFAULT 'HOMME',
    "birthdate" TIMESTAMP(3),
    "birthplace" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "categorie" "Categorie" NOT NULL DEFAULT 'FIDELE',
    "situation" "SituationMatrimoniale" NOT NULL DEFAULT 'CELIBATAIRE',
    "schoolLevel" TEXT,
    "servicePlace" TEXT,
    "baptiseDate" TIMESTAMP(3),
    "confirmDate" TIMESTAMP(3),
    "adhesionDate" TIMESTAMP(3),
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paroissiens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "associations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sigle" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "associations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "association_paroissien" (
    "id" TEXT NOT NULL,
    "paroissienId" TEXT NOT NULL,
    "associationId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "dateAdhesion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "association_paroissien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engagements" (
    "id" TEXT NOT NULL,
    "paroissienId" TEXT NOT NULL,
    "dime" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "cotisation" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "detteDime" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "detteCotisation" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "availableDime" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "availableCotisation" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "availableDetteDime" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "availableDetteCotisation" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "periodeStart" TIMESTAMP(3) NOT NULL,
    "periodeEnd" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "engagements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "versements" (
    "id" TEXT NOT NULL,
    "paroissienId" TEXT NOT NULL,
    "engagementId" TEXT,
    "type" "TypeVersement" NOT NULL,
    "somme" DECIMAL(12,2) NOT NULL,
    "dateVersement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "versements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cotisations" (
    "id" TEXT NOT NULL,
    "paroissienId" TEXT NOT NULL,
    "type" "TypeCotisation" NOT NULL,
    "somme" DECIMAL(12,2) NOT NULL,
    "forYear" INTEGER NOT NULL,
    "description" TEXT,
    "datePaiement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cotisations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offrandes" (
    "id" TEXT NOT NULL,
    "associationId" TEXT NOT NULL,
    "somme" DECIMAL(12,2) NOT NULL,
    "offrandeDay" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offrandes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "paroissiens_matricule_key" ON "paroissiens"("matricule");

-- CreateIndex
CREATE UNIQUE INDEX "paroissiens_newMatricule_key" ON "paroissiens"("newMatricule");

-- CreateIndex
CREATE INDEX "paroissiens_name_idx" ON "paroissiens"("name");

-- CreateIndex
CREATE INDEX "paroissiens_categorie_idx" ON "paroissiens"("categorie");

-- CreateIndex
CREATE INDEX "paroissiens_isActive_idx" ON "paroissiens"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "associations_name_key" ON "associations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "associations_sigle_key" ON "associations"("sigle");

-- CreateIndex
CREATE INDEX "association_paroissien_associationId_idx" ON "association_paroissien"("associationId");

-- CreateIndex
CREATE UNIQUE INDEX "association_paroissien_paroissienId_associationId_key" ON "association_paroissien"("paroissienId", "associationId");

-- CreateIndex
CREATE INDEX "engagements_paroissienId_idx" ON "engagements"("paroissienId");

-- CreateIndex
CREATE INDEX "engagements_periodeStart_periodeEnd_idx" ON "engagements"("periodeStart", "periodeEnd");

-- CreateIndex
CREATE INDEX "versements_paroissienId_idx" ON "versements"("paroissienId");

-- CreateIndex
CREATE INDEX "versements_engagementId_idx" ON "versements"("engagementId");

-- CreateIndex
CREATE INDEX "versements_dateVersement_idx" ON "versements"("dateVersement");

-- CreateIndex
CREATE INDEX "versements_type_idx" ON "versements"("type");

-- CreateIndex
CREATE INDEX "cotisations_paroissienId_idx" ON "cotisations"("paroissienId");

-- CreateIndex
CREATE INDEX "cotisations_forYear_idx" ON "cotisations"("forYear");

-- CreateIndex
CREATE INDEX "cotisations_type_idx" ON "cotisations"("type");

-- CreateIndex
CREATE INDEX "offrandes_associationId_idx" ON "offrandes"("associationId");

-- CreateIndex
CREATE INDEX "offrandes_offrandeDay_idx" ON "offrandes"("offrandeDay");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "association_paroissien" ADD CONSTRAINT "association_paroissien_paroissienId_fkey" FOREIGN KEY ("paroissienId") REFERENCES "paroissiens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "association_paroissien" ADD CONSTRAINT "association_paroissien_associationId_fkey" FOREIGN KEY ("associationId") REFERENCES "associations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engagements" ADD CONSTRAINT "engagements_paroissienId_fkey" FOREIGN KEY ("paroissienId") REFERENCES "paroissiens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versements" ADD CONSTRAINT "versements_paroissienId_fkey" FOREIGN KEY ("paroissienId") REFERENCES "paroissiens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "versements" ADD CONSTRAINT "versements_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "engagements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotisations" ADD CONSTRAINT "cotisations_paroissienId_fkey" FOREIGN KEY ("paroissienId") REFERENCES "paroissiens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offrandes" ADD CONSTRAINT "offrandes_associationId_fkey" FOREIGN KEY ("associationId") REFERENCES "associations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

