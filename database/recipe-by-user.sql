SELECT
  CASE
    WHEN r."sharedBy" IS NOT NULL THEN u."username"
    ELSE NULL
  END AS "username",
  r."idMeal",
  r."strMeal",
  r."strInstructions",
  r."strMealThumb",
  r."ingredients",
  r."strYoutube",
  r."userId",
  r."sharedBy",
  r."seenShared"
FROM "recipes" AS r
LEFT JOIN "users" AS u
  ON u."userId" = r."sharedBy"
WHERE r."idMeal" = $1;
