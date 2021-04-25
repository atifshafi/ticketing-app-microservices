import {RequestValidationError} from '../error/request-validation.js'
import {validationResult} from "express-validator";

// Used as router-level middleware
// Custom error handling middleware for consistent error message. This function is called as a middleware whenever there's a defined error is found when calling a route
export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

            if (!errors.isEmpty()) {
                // by throwing error, it will talk to error-handling middleware
                throw new RequestValidationError(errors.array())
            }

            next();
};