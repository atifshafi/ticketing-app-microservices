import express from "express";
import {body, validationResult} from 'express-validator';

const route = express.Router();

route.post(
    '/api/users/signup',
    body('email').isEmail(),
    body('password').trim(),
    body('password').isLength({min: 4, max: 20}),
    (req, res) => {
        // if req.body
        const {email, password} = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        console.log('Creating a user ...');

        res.send({});

        // new User({email, password})
    }
);

export {route as signupRouter};