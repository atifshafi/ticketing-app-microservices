import express from "express";
import jwt from "jsonwebtoken";

const route = express.Router();

//Purpose of this router to verify validity of jwt of a session. Client will make a req to this endpoint to verify exactly that.
route.get('/api/users/currentuser', (req, res) => {
    // Verify if token is null
    if (!req.session.jwt) {
        return res.send({currentUser: null})
    }

    // Validate token
    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY);
        res.send({currentUser: payload})
    } catch (err) {
        return res.send({currentUser: null})
    }

});

export {route as currentUserRouter};