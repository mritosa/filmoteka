-- Creator:       MySQL Workbench 8.0.29/ExportSQLite Plugin 0.1.0
-- Author:        Unknown
-- Caption:       New Model
-- Project:       Name of the project
-- Changed:       2023-10-15 13:31
-- Created:       2023-10-11 16:44

BEGIN;
CREATE TABLE "tip_korisnika"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "naziv" VARCHAR(45) NOT NULL,
  "opis" VARCHAR(45),
  CONSTRAINT "naziv_UNIQUE"
    UNIQUE("naziv")
);
CREATE TABLE "serija"(
  "tmdb_id" INTEGER PRIMARY KEY NOT NULL,
  "naziv" VARCHAR(300),
  "opis" TEXT,
  "broj_sezona" INTEGER,
  "broj_epizoda" INTEGER,
  "popularnost" INTEGER,
  "slika" VARCHAR(200)
);
CREATE TABLE "sezona"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "naziv" VARCHAR(200),
  "opis" TEXT,
  "slika" VARCHAR(200),
  "broj_sezone" INTEGER,
  "broj_epizoda_u_sezoni" INTEGER NOT NULL,
  "tmdb_id_sezone" INTEGER NOT NULL,
  "serija_tmdb_id" INTEGER NOT NULL,
  CONSTRAINT "fk_sezona_serija1"
    FOREIGN KEY("serija_tmdb_id")
    REFERENCES "serija"("tmdb_id")
);
CREATE INDEX "sezona.fk_sezona_serija1_idx" ON "sezona" ("serija_tmdb_id");
CREATE TABLE "korisnik"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "ime" VARCHAR(50),
  "prezime" VARCHAR(100),
  "adresa" TEXT,
  "korime" VARCHAR(50) NOT NULL,
  "lozinka" VARCHAR(1000) NOT NULL,
  "email" VARCHAR(100) NOT NULL,
  "tip_korisnika_id" INTEGER NOT NULL,
  CONSTRAINT "korime_UNIQUE"
    UNIQUE("korime"),
  CONSTRAINT "email_UNIQUE"
    UNIQUE("email"),
  CONSTRAINT "fk_korisnik_tip_korisnika"
    FOREIGN KEY("tip_korisnika_id")
    REFERENCES "tip_korisnika"("id")
);
CREATE INDEX "korisnik.fk_korisnik_tip_korisnika_idx" ON "korisnik" ("tip_korisnika_id");
CREATE TABLE "favoriti"(
  "korisnik_id" INTEGER NOT NULL,
  "serija_tmdb_id" INTEGER NOT NULL,
  PRIMARY KEY("korisnik_id","serija_tmdb_id"),
  CONSTRAINT "fk_korisnik_has_serija_korisnik1"
    FOREIGN KEY("korisnik_id")
    REFERENCES "korisnik"("id"),
  CONSTRAINT "fk_korisnik_has_serija_serija1"
    FOREIGN KEY("serija_tmdb_id")
    REFERENCES "serija"("tmdb_id")
);
CREATE INDEX "favoriti.fk_korisnik_has_serija_serija1_idx" ON "favoriti" ("serija_tmdb_id");
CREATE INDEX "favoriti.fk_korisnik_has_serija_korisnik1_idx" ON "favoriti" ("korisnik_id");
CREATE TABLE "dnevnik"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "korisnik_id" INTEGER NOT NULL,
  "datum_i_vrijeme" DATETIME,
  "metoda" VARCHAR(45),
  "ruta" VARCHAR(45),
  "opis_dogadaja" VARCHAR(45),
  CONSTRAINT "fk_dnevnik_korisnik1"
    FOREIGN KEY("korisnik_id")
    REFERENCES "korisnik"("id")
);
CREATE INDEX "dnevnik.fk_dnevnik_korisnik1_idx" ON "dnevnik" ("korisnik_id");
COMMIT;


INSERT INTO tip_korisnika(naziv,opis)  VALUES("admin","administrator");
UPDATE tip_korisnika
SET naziv = 'korisnik', opis = 'korisnik'
WHERE naziv = 'moderator';

SELECT *
FROM serija
JOIN sezona ON serija.tmdb_id = sezona.serija_tmdb_id
WHERE serija.tmdb_id = 60574;

SELECT * FROM sezona WHERE serija_tmdb_id=60574;
SELECT * FROM serija WHERE tmdb_id = 60574;

DELETE From korisnik WHERE id = 10;