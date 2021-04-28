import express from "express";
import {body, validationResult} from 'express-validator';
import {BadRequestError} from '../error/bad-request-error.js'
import {validateRequest} from '../middleware/validate-request.js'
import {User} from '../models/users.js'
import jwt from 'jsonwebtoken'

const route = express.Router();

route.post(
    '/api/users/signup',
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min: 4, max: 20}).withMessage('Password must be between 4 and 20 characters'),
    validateRequest,
    async (req, res) => {
        const {email, password} = req.body;

        // Check if email exists
        const document = await User.findOne({email: email}).exec();
        if (document) {
            throw new BadRequestError('Email in use')
        }

        console.log('Creating a user ...');
        // Create an user
        const user = await User.create({'email': email, 'password': password});

        // Generate JWT and store it in the session. Note that by adding to the session object, it's encodes jwt with base64
        req.session.jwt = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY);


        res.status(201).send(user);

    }
);

export {route as signupRouter};