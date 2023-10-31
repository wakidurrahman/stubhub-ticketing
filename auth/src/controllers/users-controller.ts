import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { getUsers } from '@/db/users-query';
import { BadRequestError } from '@/errors/bad-request-error';
import Message from '@/utils/message';

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.session?.jwt) {
      return next(new BadRequestError(`${Message.REQUEST_BODY_IS_EMPTY}`));
    }

    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);

    return res
      .status(200)
      .json({
        status: 'success',
        message: Message.PARTICULAR_DATA_FATCH,
        data: payload,
      })
      .end();
  } catch (error) {
    return next(new BadRequestError(`${Message.REQUEST_BODY_IS_EMPTY}`));
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getUsers();
    return res
      .status(200)
      .json({
        status: 'success',
        message: Message.DATA_FETCH,
        data: users,
      })
      .end();
  } catch (error) {
    return next(new BadRequestError(`${Message.REQUEST_BODY_IS_EMPTY}`));
  }
};
