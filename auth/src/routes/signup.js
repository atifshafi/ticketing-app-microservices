import express from "express";
import {body, validationResult} from 'express-validator';
import {RequestValidationError} from '../error/request-validation.js'
import {DatabaseConnectionError} from '../error/database-connection.js'

const route = express.Router();

route.post(
    '/api/users/signup',
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim(),
    body('password').isLength({min: 4, max: 20}).withMessage('Password must be between 4 and 20 characters'),
    (req, res) => {
        // if req.body
        const {email, password} = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // by throwing error, it will talk to error-handling middleware
            throw new RequestValidationError(errors.array())
        }

        console.log('Creating a user ...');
        throw new DatabaseConnectionError()

        res.send({});

        // new User({email, password})
    }
);

export {route as signupRouter};