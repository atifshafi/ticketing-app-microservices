import express from "express";
import bodyParser from "body-parser";



import { currentUserRouter } from './routes/current-user.js';
import { signupRouter } from './routes/signup.js';
import { siginRouter } from './routes/signin.js';
import { signoutRouter } from './routes/signout.js';


const app = express();
app.use(bodyParser.json());
app.use(express.json());


app.use(currentUserRouter);
app.use(signupRouter);
app.use(siginRouter);
app.use(signoutRouter);


app.listen(3000, () => {
    console.log('auth server started: 3000!');
});



