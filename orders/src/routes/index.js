import express from "express";

const route = express.Router();

//Purpose of this router to verify validity of jwt of a session. Client will make a req to this endpoint to verify exactly that.
route.get('/api/orders', async (req, res) => {
    res.send({});

});

export {route as indexOrderRouter};