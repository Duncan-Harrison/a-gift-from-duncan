/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express, { application } from 'express';
import pg from 'pg';
import { ClientError, errorMiddleware } from './lib/index.js';
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

app.get('/api/recipes', async (req, res, next) => {
  try {
    const sql = `
      select *
      from "recipes";
    `;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
  /* res.json({ message: 'Hello, World!' }); */
});

app.post('/api/recipes', async (req, res, next) => {
  try {
    const {
      idMeal,
      strMeal,
      strInstructions,
      strMealThumb,
      ingredients,
      measurements,
      strYoutube,
    } = req.body;
    console.log('Recipe Body', req.body);
    if (idMeal === undefined || strMeal === undefined) {
      throw new ClientError(400, `idMeal or name of Meal is missing`);
    }
    const sql = `
      insert into "recipes" ("idMeal", "strMeal", "strInstructions", "strMealThumb", "ingredients", "measurements", "strYoutube")
      values ($1, $2, $3, $4, $5, $6, $7)
      returning *;
    `;
    const params = [
      idMeal,
      strMeal,
      strInstructions,
      strMealThumb,
      ingredients,
      measurements,
      strYoutube,
    ];
    const result = await db.query(sql, params);
    const mealList = result.rows[0];
    if (!mealList) throw new ClientError(404, `Cannot find added recipe`);
    res.status(201).json(mealList);
  } catch (err) {
    next(err);
  }
});

app.get('/api/faveIngredients', async (req, res, next) => {
  try {
    const sql = `
    select *
    from "faveIngredients";
    `;
    const result = await db.query(sql);
    res.json(result.rows);
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
    const hashedPassword = await argon2.hash(password);
    if (!hashedPassword)
      throw new ClientError(
        404,
        'Password could not be accepted. Please try again.'
      );
    const sql = `
      insert into "users" ("username", "hashedPassword")
      values ($1, $2)
      returning *;
    `;
    const params = [username, hashedPassword];
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
    if (!(await argon2.verify(user.hashedPassword, password)))
      throw new ClientError(401, 'invalid login');
    const { userId } = user;
    const payload = { userId, username };
    const token = jwt.sign(payload, hashKey);
    res.status(200).json({ token, user: payload });
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
