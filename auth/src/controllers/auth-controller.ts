import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { createUser, getUserByEmail } from '@/db/users-query';
import { BadRequestError } from '@/errors/bad-request-error';
import { RequestValidationError } from '@/errors/request-validation-error';
import Message from '@/utils/message';

/**
 * register Controller
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // step 1: Check request  body
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new BadRequestError(`${Message.REQUEST_BODY_IS_EMPTY}`));
    }

    // step 2: Handling validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new RequestValidationError(errors.array()));
    }

    // step 3: Check Existing User
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return next(
        new BadRequestError(`${Message.ACCOUNT_WITH_THAT_EMAIL_ALREADY_EXISTS}`)
      );
    }

    // step 4: Create new user

    const user = await createUser({
      email,
      password,
    });

    // step 6: Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!,
      {
        expiresIn: process.env.JWT_EXP!,
      }
    );

    // step 7: Store it on session object
    req.session = {
      jwt: token
    }
    // step 8: Response After user implement

    return res
      .status(201)
      .json({
        status: 'success',
        message: Message.CREATE_SUCCESSFUL,
        data: user,
      })
      .end();
  } catch (error) {
    console.log(error);
    return next(new BadRequestError(`${Message.SOME_THING_MISSING}`));
  }
};

export const singUpUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  res.status(200).json({
    status: 'Ok',
  });
};
/**
 * Fetch Particular user
 * GET /posts
 */
export const getParticularUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(201).json({
    status: 'Ok',
  });
};
