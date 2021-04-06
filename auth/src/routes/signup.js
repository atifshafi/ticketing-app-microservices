import express from "express";
const route = express.Router();

route.post('/api/users/signup', (req,res) =>{
    res.send("signed up!");
})

export {route as signupRouter};