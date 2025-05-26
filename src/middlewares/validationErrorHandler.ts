import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => {
      if ('param' in err) {
        return {
          field: err.param,
          message: err.msg,
        };
      }
      return {
        field: 'unknown',
        message: err.msg,
      };
    });

    res.status(400).json({
      success: false,
      errors: formattedErrors,
    });
    return;
  }
  next();
};
