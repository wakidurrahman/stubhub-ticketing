import express from 'express';

import authentication from './auth-routes';
import users from './users-routes';

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);

  return router;
};