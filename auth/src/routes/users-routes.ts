import express from 'express';

import { currentUser, getAllUsers } from '@/controllers/users-controller';

export default (router: express.Router) => {
  router.get('/users', getAllUsers);
  /**
   * @desc      Register/SignUp user, Create a new local account.
   * @route     GET /api/v1/auth/currentuser
   * @access    Public
   */
  router.get('/currentuser', currentUser);
};