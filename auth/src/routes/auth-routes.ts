// https://zenn.dev/himorishige/articles/5084aab24c9f35
import express from 'express';

import { login, register, signout } from '@/controllers/auth-controller';
import { body } from 'express-validator';

export default (router: express.Router) => {
  /**
   * Create all kinds of platforms user  into this application
   * @desc      Register/SignUp user, Create a new local account.
   * @route     POST /api/v1/auth/register
   * @access    Public
   */

  router.post(
    '/auth/register',
    [
      body('email').isEmail().withMessage('Email must be valid'),
      body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters'),
    ],
    register
  );

  /**
   * @desc      Sign/login in using email and password.
   * @route     POST /api/v1/auth/signin
   * @access    Public
   */
  router.post(
    '/auth/login',
    [
      body('email').isEmail().withMessage('Email must be valid'),
      body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password'),
    ],
    login
  );
  /**
   * @desc      signout from this platform.
   * @route     POST /api/v1/auth/signout
   * @access    Public
   */
  router.post('/auth/signout', signout);
};
