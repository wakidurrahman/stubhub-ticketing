// https://zenn.dev/himorishige/articles/5084aab24c9f35
import express, { NextFunction, Request, Response } from 'express';

import { getParticularUser, register } from '@/controllers/auth-controller';
import UserModel from '@/models/users-model';
import { findAllQuery } from '@/services/auth-service';
import Message from '@/utils/message';
import { body } from 'express-validator';

const router = express.Router();

const authentication = (router: express.Router) => {

/**
 * Create all kinds of platforms user  into this application
 * @desc      Register/SignUp user, Create a new local account.
 * @route     POST /api/v1/auth/register
 * @access    Public
 */

router.post(
  '/register',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
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
  '/signin',async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    console.log(req.body);
    res.send('Hi there!');
  }
);
/**
 * @desc      signout from this platform.
 * @route     POST /api/v1/auth/signout
 * @access    Public
 */
router.post(
  '/signout',async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    console.log(req.body);
    res.send('Hi there!');
  }
);

/**
 *
 * @desc     Get all users.
 * @route     GET /api/v1/auth/users
 * @access    Public
 */
router.get(
  '/users',async (req: Request, res: Response, next: NextFunction) => {
    const users = await findAllQuery(UserModel, {});
    console.log(users);
    res.status(200).json({
      status: 'success',
      message: Message.DATA_FETCH,
      data: users,
    });
  }
);
/**
 * @desc      Register/SignUp user, Create a new local account.
 * @route     GET /api/v1/auth/currentuser
 * @access    Public
 */
router.route('/currentuser').get(getParticularUser);

}

export default (): express.Router => {
  authentication(router);

  return router;
};
