import {NotAuthorizedError} from '../error/not-authorized-error.js'

// Used as router-level middleware
export const requireAuth = (req, res, next) => {
    // When user is not signed in
    if (!req.currentUser) {
        throw new NotAuthorizedError();
    }

    next();
};