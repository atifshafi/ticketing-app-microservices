import express from "express";
const route = express.Router();

route.get('/api/users/currentuser', (req,res) =>{
    res.send("Hello World! ppl");
});

export {route as currentUserRouter};