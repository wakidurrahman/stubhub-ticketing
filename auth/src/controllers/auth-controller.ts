import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { getUserByEmail } from '@/db/users-query';
import { BadRequestError } from '@/errors/bad-request-error';
import { RequestValidationError } from '@/errors/request-validation-error';
import { createUserService } from '@/services/auth-service';
import Message from '@/utils/message';

/**
 * register Controller
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const register = 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // step 1: Check body 
      const { email, password } = req.body;

      if (!email || !password ) {
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
        return next(new BadRequestError('Email in use'));
      }
      await createUserService({ email, password });

      res.status(201).json({
        status: 'success',
        message: Message.CREATE_SUCCESSFUL,
        data: null,
      });
    } catch (error) {
      console.log(error);
    }
  };

export const singUpUser = 
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    res.status(200).json({
      status: 'Ok',
    });
  }
;
/**
 * Fetch Particular user
 * GET /posts
 */
export const getParticularUser = 
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(201).json({
      status: 'Ok',
    });
  };
