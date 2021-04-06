import express from "express";
const route = express.Router();

route.post('/api/users/signout', (req,res) =>{
    res.send("Signoined out!");
})

export {route as signoutRouter};