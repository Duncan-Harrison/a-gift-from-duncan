/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express, { application } from 'express';
import pg from 'pg';
import { authMiddleware, ClientError, errorMiddleware } from './lib/index.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

type User = {
  userId: number;
  username: string;
  hashedPassword: string;
};
type Auth = {
  username: string;
  password: string;
};

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();
app.use(express.json());
// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));

/*
put my routes here.
original code:
*/

app.get('/api/recipes', authMiddleware, async (req, res, next) => {
  try {
    const sql = `
      select *
      from "recipes"
      where "userId" = $1;
    `;
    const params = [req.user?.userId];
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
  /* res.json({ message: 'Hello, World!' }); */
});

app.get('/api/recipes/:idMeal', authMiddleware, async (req, res, next) => {
  try {
    const idMeal = req.params.idMeal;
    if (!idMeal) throw new ClientError(400, 'Cannot recognize the idMeal');
    const sql = `
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
    `;
    const params = [idMeal];
    const result = await db.query(sql, params);
    if (!result.rows[0])
      throw new ClientError(404, `Cannot find recipe with ID ${idMeal}`);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.get('/api/recipes/:strMeal', authMiddleware, async (req, res, next) => {
  try {
    const strMeal = req.params.strMeal;
    if (!strMeal)
      throw new ClientError(400, 'Cannot recognize the meal by name');
    const sql = `
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
WHERE r."strMeal" = $1;
    `;
    const params = [strMeal];
    const result = await db.query(sql, params);
    if (!result.rows[0])
      throw new ClientError(404, `Cannot find recipe named ${strMeal}`);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.post('/api/recipes', authMiddleware, async (req, res, next) => {
  try {
    const {
      idMeal,
      strMeal,
      strInstructions,
      strMealThumb,
      ingredients,
      strYoutube,
    } = req.body;
    console.log('Recipe Body', req.body);
    if (idMeal === undefined || strMeal === undefined) {
      throw new ClientError(400, `idMeal or name of Meal is missing`);
    }
    const sql = `
      insert into "recipes" ("idMeal", "strMeal", "strInstructions", "strMealThumb", "ingredients", "strYoutube", "userId")
      values ($1, $2, $3, $4, $5, $6, $7)
      returning *;
    `;
    const params = [
      idMeal,
      strMeal,
      strInstructions,
      strMealThumb,
      ingredients,
      strYoutube,
      req.user?.userId,
    ];
    const result = await db.query(sql, params);
    const mealList = result.rows[0];
    if (!mealList) throw new ClientError(404, `Cannot find added recipe`);
    res.status(201).json(mealList);
  } catch (err) {
    next(err);
  }
});

app.post('/api/recipes/shared', authMiddleware, async (req, res, next) => {
  try {
    const {
      idMeal,
      strMeal,
      strInstructions,
      strMealThumb,
      ingredients,
      strYoutube,
      userId,
    } = req.body;
    console.log('Recipe Body', req.body);
    if (idMeal === undefined || strMeal === undefined) {
      throw new ClientError(400, `idMeal or name of Meal is missing`);
    }
    const sql = `
      insert into "recipes" ("idMeal", "strMeal", "strInstructions", "strMealThumb", "ingredients", "strYoutube", "userId", "sharedBy")
      values ($1, $2, $3, $4, $5, $6, $7, $8)
      returning *;
    `;
    const params = [
      idMeal,
      strMeal,
      strInstructions,
      strMealThumb,
      ingredients,
      strYoutube,
      userId,
      req.user?.userId,
    ];
    const result = await db.query(sql, params);
    const mealList = result.rows[0];
    if (!mealList) throw new ClientError(404, `Cannot find added recipe`);
    res.status(201).json(mealList);
  } catch (err) {
    next(err);
  }
});

app.get('/api/users/:username', authMiddleware, async (req, res, next) => {
  try {
    const { username } = req.params;
    const sql = `
    select "username",
          "userId"
    from "users"
    where "username" = $1;
    `;
    const params = [username];
    const result = await db.query(sql, params);
    if (!result.rows[0])
      throw new ClientError(
        404,
        `Cannot find a user named ${username}. Are you sure you spelled the username correctly?`
      );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

app.get('/api/faveIngredients', authMiddleware, async (req, res, next) => {
  try {
    const sql = `
    select *
    from "faveIngredients"
    where "userId" = $1;
    `;
    const params = [req.user?.userId];
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.post('/api/faveIngredients', authMiddleware, async (req, res, next) => {
  try {
    const { idIngredient, strIngredient } = req.body;
    if (!idIngredient) {
      throw new ClientError(400, 'ingredient ID is a required field.');
    }
    const sql = `
      insert into "faveIngredients" ("userId", "idIngredient", "strIngredient")
      values ($1, $2, $3)
      returning *;
    `;
    const params = [req.user?.userId, idIngredient, strIngredient];
    const result = await db.query(sql, params);
    const newFave = result.rows[0];
    if (!newFave)
      throw new ClientError(404, 'Could not add your favorite ingredient.');
    res.status(201).json(newFave);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }
    const hashedpassword = await argon2.hash(password);
    if (!hashedpassword)
      throw new ClientError(
        404,
        'Password could not be accepted. Please try again.'
      );
    const sql = `
      insert into "users" ("username", "hashedpassword")
      values ($1, $2)
      returning *;
    `;
    const params = [username, hashedpassword];
    const result = await db.query(sql, params);
    const newUser = result.rows[0];
    if (!newUser)
      throw new ClientError(404, 'Could not add username or password');
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
      select *
      from "users"
      where "username" = $1;
    `;
    const params = [username];
    const result = await db.query(sql, params);
    if (!result) throw new ClientError(401, 'Invalid login');
    const user = result.rows[0];
    const hashKey = process.env.TOKEN_SECRET;
    if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');
    if (!(await argon2.verify(user.hashedpassword, password)))
      throw new ClientError(401, 'invalid login');
    const { userId } = user;
    const payload = { userId, username };
    const token = jwt.sign(payload, hashKey);
    res.status(200).json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

app.put('/api/recipes/:idMeal', authMiddleware, async (req, res, next) => {
  try {
    const idMeal = Number(req.params.idMeal);
    if (idMeal === undefined && Number.isInteger(+idMeal)) {
      throw new ClientError(400, `idMeal is missing or must be an integer.`);
    }
    const { ingredients } = req.body;
    if (ingredients.length < 1 || ingredients === undefined) {
      throw new ClientError(400, `Ingredients are missing.`);
    }
    const sql = `
        update "recipes"
        set "ingredients" = $2
        where "idMeal" = $1
        returning *;
      `;
    const params = [idMeal, ingredients];
    const result = await db.query(sql, params);
    const newIngredients = result.rows[0];
    if (!newIngredients)
      throw new ClientError(404, `Cannot find this recipe in the database.`);
    res.status(200).json(newIngredients);
  } catch (err) {
    next(err);
  }
});

/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});
