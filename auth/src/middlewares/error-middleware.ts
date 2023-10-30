import { AuthCustomErrorHandler } from '@/errors/auth-custom-error-handler';
import { ErrorResponse } from '@/errors/error-response';
import Message from '@/utils/message';
import { NextFunction, Request, Response } from 'express';



const sendErrorDev = (
  err: { statusCode: number; status: string; message: string; stack: string },
  res: Response<any, Record<string, any>>
) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (
  err: { isOperational: boolean; statusCode: number; status: string; message: string },
  res: Response<any, Record<string, any>>
) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new Error(`Not Found -${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (
  err: Error | string | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AuthCustomErrorHandler) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: Message.SOME_THING_MISSING,
      errors: err.serializeErrors(),
      data: null,
    });
  }

  if (typeof err === 'string') {
    // custom application error
    const error = new ErrorResponse(err || '', 400);
    res.status(400).json({
      status: error.status,
      message: error.message,
    });
    // stop further execution in this callback
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError' && err.errors) {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    // eslint-disable-next-line prefer-const
    let valErrors: any[] = [];
    Object.keys(err.errors).forEach((key) =>
      valErrors.push(err.errors[key].message)
    );
    res.status(422).json({
      status: 'error',
      message: Message.SOME_THING_MISSING,
      errors: valErrors,
      data: null,
    });
    // stop further execution in this callback
    return;
  }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
      const message = `Invalid ${err.path}: ${err.value}.`;
      res.status(400).json({
        status: 'fail',
        message: message,
      });
      // stop further execution in this callback
      return;
    }

  // Mongoose duplicate key
  if (err.code === 11000) {
    // const message = 'Duplicate field value entered';
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);
    const message = `Duplicate field value: ${value}. Please use another value!`;
    res.status(400).json({
      status: 'fail',
      message,
    });
    // stop further execution in this callback
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    const message = 'invalid token';
    res.status(500).json({
      status: 'error',
      message,
    });
    // stop further execution in this callback
    return;
  }

  // default to 500 server error

  if (process.env.NODE_ENV === 'development') {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    return sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    return sendErrorProd(err, res);
  }

    // Default to 500 server error
    if (process.env.NODE_ENV === 'development') {
      (err as { statusCode: number; status: string }).statusCode = (err as { statusCode: number; status: string }).statusCode || 500;
      (err as { statusCode: number; status: string }).status = (err as { statusCode: number; status: string }).status || 'error';
      // Implement sendErrorDev method logic here
       sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
      (err as { statusCode: number; status: string }).statusCode = (err as { statusCode: number; status: string }).statusCode || 500;
      (err as { statusCode: number; status: string }).status = (err as { statusCode: number; status: string }).status || 'error';
      // Implement sendErrorProd method logic here
       sendErrorProd(err, res);
    }
};
