-- Add telefono column to Registration

ALTER TABLE "Registration"
ADD COLUMN "telefono" TEXT NOT NULL DEFAULT '';
