import {RequestValidationError} from '../error/request-validation.js'
import {DatabaseConnectionError} from '../error/database-connection.js'
import {BadRequestError} from "../error/bad-request-error.js";
import {NotFoundError} from '../error/not-found-error.js'

// Custom error handling middleware for consistent error message
export const errorHandler = (err, req, res, next) => {
    // Verifying type of error
    if (err instanceof RequestValidationError) {
        return res.status(err.statusCode).send(err.serializeErrors());
    }
    if (err instanceof DatabaseConnectionError) {
        return res.status(err.statusCode).send(err.serializeErrors());
    }
    if (err instanceof BadRequestError) {
        return res.status(err.statusCode).send(err.serializeErrors());
    }
    if (err instanceof NotFoundError) {
        return res.status(err.statusCode).send(err.serializeErrors());
    }

    res.status(400).send({
        errors: [{message: 'Something went wrong'}]
    });
};