import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, urlencoded } from 'express';

import { NotFoundError } from '@/errors/not-found-error';
import { errorHandler } from '@/middlewares/error-middleware';
import routes from '@/routes';

const app: Express = express();
app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(urlencoded({ extended: true }));
app.use(cookieSession({ signed: false, secure: false }));
dotenv.config();

{
  /* ↓↓↓ CORS Settings */
}
app.use(
  cors({
    credentials: true,
  })
);

{
  /* ↓↓↓ Route Handler */
}
app.use('/api/v1', routes());

// Handle unknown url

app.all('*', async (req, res, next) => {
  next(new NotFoundError());
});

// Global Error Handler
app.use(errorHandler);
{
  /* ↑↑↑ Route Handler */
}

export default app;
