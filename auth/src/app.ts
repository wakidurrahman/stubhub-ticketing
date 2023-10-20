import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, urlencoded } from 'express';


import { NotFoundError } from '@/errors/not-found-error';
import { errorHandler } from '@/middlewares/error-middleware';
import authRoutes from '@/routes/auth-routes';

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
app.use('/api/v1/auth', authRoutes());

app.all('*', async (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);
{
  /* ↑↑↑ Route Handler */
}


export default app;


