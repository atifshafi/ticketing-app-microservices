import jwt from "jsonwebtoken";

export const currentUser = (req, res, next) => {
 // Verify if token is null
    if (!req.session.jwt) {
        return next();
    }

    // Validate token
    try {
        // Define payload of the user information to 'currentUser'
        req.currentUser = jwt.verify(req.session.jwt, process.env.JWT_KEY);
    } catch (err) {
    }

    next();
    }