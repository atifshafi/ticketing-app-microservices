import express from "express";
import bodyParser from "body-parser";


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

// Handling all invalid requests (add async)
app.all('*', () => {
    throw new NotFoundError();
});

// errorhandler knows it's a error since 4 param are being passed including 'err'
app.use(errorHandler);


app.listen(3000, () => {
    console.log('auth server started: 3000!');
});



