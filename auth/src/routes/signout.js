import express from "express";
const route = express.Router();

// This router will clear up any jwt associated with a session
route.post('/api/users/signout', (req,res) =>{
    req.session = null;
    res.send({});
})

export {route as signoutRouter};