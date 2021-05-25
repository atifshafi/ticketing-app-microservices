// Exporting 'app' for other uses such as testing.
import express from 'express';
import bodyParser from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import {newOrderRouter} from './routes/new.js';
import {deleteOrderRouter} from './routes/delete.js';
import {indexOrderRouter} from './routes/index.js';
import {showOrderRouter} from './routes/show.js';
import {errorHandler, NotFoundError, currentUser} from '@atiftickets/common';


const app = express();
// Binding application-level middleware to an instance of the app object (have access to - req, res, next()) by using the app.use().
// Mounts the specified middleware function or functions at the specified path: the middleware function is executed when the base of the requested path matches path. A middleware mounted without a path will be executed for every request to the app.
app.use(bodyParser.json());
app.use(express.json());
// This will tell express to trust incoming 'https' requests from a proxy server
app.set('trust proxy', true);

// Cookies will be used as a transporter of jwt. This needs to run before other middlewares set here so that 'req.session' is correctly set
app.use(
    cookieSession({
        // Disabling encrypting cookie (using jwt with exp)
        signed: false,
        // Cookies will only be used when the user is accessing the app over https connection
        secure: true
    }))


app.use(currentUser);
app.use(newOrderRouter);
app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(showOrderRouter);

// Handling all invalid requests. Note that adding 'async' means the function will return a promise based object in the future instead of immediately returning.
// For asynchronous route handler, we need to rely on 'next()' function. OR use 'express-async-errors'
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

// errorhandler knows it's a error since 4 param are being passed including 'err'
app.use(errorHandler);

export { app };