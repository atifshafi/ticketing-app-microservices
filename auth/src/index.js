import express from "express";
import bodyParser from "body-parser";
import 'express-async-errors';
import mongoose from 'mongoose';

import {currentUserRouter} from './routes/current-user.js';
import {signupRouter} from './routes/signup.js';
import {siginRouter} from './routes/signin.js';
import {signoutRouter} from './routes/signout.js';
import {errorHandler} from './middleware/error-handler.js';
import {NotFoundError} from "./error/not-found-error.js";


const app = express();
app.use(bodyParser.json());
app.use(express.json());


app.use(currentUserRouter);
app.use(signupRouter);
app.use(siginRouter);
app.use(signoutRouter);

// Handling all invalid requests. Note that adding 'async' means the function will return a promise based object in the future instead of immediately returning.
// For asynchronous route handler, we need to rely on 'next()' function. OR use 'express-async-errors'
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

// errorhandler knows it's a error since 4 param are being passed including 'err'
app.use(errorHandler);

const start = async () => {
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log("Connected to MongoDB ...")
    } catch (err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log('auth server started: 3000!');
    });
}

start();