set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";
CREATE TABLE "public"."users" (
  "userId" integer PRIMARY KEY,
  "username" varchar,
  "hashedpassword" varchar,
  "created_at" timestamp
);

CREATE TABLE "public"."recipes" (
  "idMeal" varchar NOT NULL,
  "strMeal" varchar NOT NULL,
  "strInstructions" varchar NOT NULL,
  "strMealThumb" varchar,
  "ingredients" varchar[],
  "measurements" varchar[],
  "strYoutube" varchar,
  "userId" integer,
  "sharedBy" integer DEFAULT null,
  "seenShared" bool DEFAULT null
  primary key ("idMeal")
);

CREATE TABLE "public"."faveIngredients" (
  "userId" integer NOT NULL,
  "idIngredient" varchar NOT NULL
);

ALTER TABLE "recipes" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "recipes" ADD FOREIGN KEY ("sharedBy") REFERENCES "users" ("userId");

ALTER TABLE "faveIngredients" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");
