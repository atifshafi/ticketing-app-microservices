import express from "express";
import {body} from "express-validator";
import {validateRequest} from '../middleware/validateRequest.js'
import {User} from "../models/users.js";
import {BadRequestError} from "../error/bad-request-error.js";
import {Password} from "../services/password.js"
import jwt from "jsonwebtoken";

const route = express.Router();

route.post(
    '/api/users/signin',
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password'),
    validateRequest,
    async (req, res) => {
        const {email, password} = req.body;

        // Check if email exists
        const existingUser = await User.findOne({email: email}).exec();

        if (!existingUser) {
            throw new BadRequestError('Invalid credentials')
        }

        // Verify password
        if (!await Password.compare(existingUser.password, password)) {
            throw new BadRequestError('Invalid credentials')
        }


        // Generate JWT and store it in the session. Note that by adding to the session object, it's encodes jwt with base64
        req.session.jwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, process.env.JWT_KEY);


        // FIx cookie issue
        res.status(200).send(existingUser);
    });

export {route as siginRouter};