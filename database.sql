-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

CREATE TABLE IF NOT EXISTS "user" (
    "id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
    "username" text NOT NULL UNIQUE,
    "password" text NOT NULL,
    "acces_level" bigint DEFAULT '1',
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "user_profile" (
    "id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
    "favored_location" text NOT NULL,
    "is_favorited" boolean NOT NULL DEFAULT false,
    "user_id" bigint NOT NULL,
    "search_history" text NOT NULL,
    "use_user_loc" boolean NOT NULL DEFAULT false,
    "home_state" text NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "business_table" (
    "id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
    "business_id" bigint NOT NULL,
    "business_name" bigint,
    "address" text,
    "business_type" text,
    "description" text,
    "happyhour_events" text,
    "date" date,
    "time" time without time zone,
    PRIMARY KEY ("id")
);


ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_fk3" FOREIGN KEY ("user_id") REFERENCES "user"("id");
ALTER TABLE "business_table" ADD CONSTRAINT "business_table_fk1" FOREIGN KEY ("business_id") REFERENCES "user"("id");


ALTER TABLE "user_profile" 
DROP COLUMN "home_state";