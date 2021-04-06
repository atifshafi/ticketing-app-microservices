import express from "express";
const route = express.Router();

route.get('/api/users/currentuser', (req,res) =>{
    res.send("Hello World!");
})

export {route as currentUserRouter};