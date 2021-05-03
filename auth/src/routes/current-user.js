import express from "express";
import {currentUser} from "@atiftickets/common"

const route = express.Router();

//Purpose of this router to verify validity of jwt of a session. Client will make a req to this endpoint to verify exactly that.
route.get('/api/users/currentuser', currentUser, (req, res) => {
    res.send({ currentUser: req.currentUser || null });

});

export {route as currentUserRouter};