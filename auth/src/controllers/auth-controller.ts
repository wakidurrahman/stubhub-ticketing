import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { createUser, getUserByEmail } from '@/db/users-query';
import { BadRequestError } from '@/errors/bad-request-error';
import { ErrorResponse } from '@/errors/error-response';
import { RequestValidationError } from '@/errors/request-validation-error';
import { UserDocument } from '@/models/users-model';
import { PasswordService } from '@/services/password-service';
import Message from '@/utils/message';

function sendTokenResponse(
  user: UserDocument & { _id: import('mongoose').Types.ObjectId },
  req: Request
) {
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
  console.log(token)

  // step 7: Store it on session object
  req.session = {
    jwt: token,
  };
}

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

    //step 5:  Generate JWT and Store it on session object
    sendTokenResponse(user, req);
    // step 6: Response After user implement

    return res
      .status(200)
      .json({
        status: 'success',
        message: 'User login successful!',
        data: user,
      })
      .end();
  } catch (error) {
    console.log(error);
    return next(new BadRequestError(`${Message.SOME_THING_MISSING}`));
  }
};

export const login = async (
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

    console.log(email);

    // step 2: Find login user by email
    const existingUser = await getUserByEmail(email).select('+password');
    if (!existingUser) {
      return next(new BadRequestError(`${Message.INVALID_CREDENTIALS}`));
    }

    // step 3: Match existing user Password
    const passwordsMatch = await PasswordService.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      return next(new ErrorResponse(`${Message.INVALID_CREDENTIALS}`, 403));
    }

    // step 4: Generate JWT and Store it on session object
    sendTokenResponse(existingUser, req);

    return res
      .status(200)
      .json({
        status: 'success',
        message: Message.CREATE_SUCCESSFUL,
        data: existingUser,
      })
      .end();
  } catch (error) {
    return next(new BadRequestError(`${Message.SOME_THING_MISSING}`));
  }
};

/**
 * @desc      signout from this platform.
 * @route     POST /api/v1/auth/signout
 * @access    Public
 */
export const signout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.session = null;

    res.send({});
  } catch (error) {
    return next(new BadRequestError(`${Message.SOME_THING_MISSING}`));
  }
};

