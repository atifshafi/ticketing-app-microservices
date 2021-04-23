import {RequestValidationError} from '../error/request-validation.js'
import {validationResult} from "express-validator";

// Custom error handling middleware for consistent error message
export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

            if (!errors.isEmpty()) {
                // by throwing error, it will talk to error-handling middleware
                throw new RequestValidationError(errors.array())
            }

            next();
};