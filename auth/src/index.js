import express from 'express';
import bodyParser from "body-parser";

import currentUserRouter from './routes/current-user';
import signupRouter from './routes/signup';
import siginRouter from './routes/signin';
import signoutRouter from './routes/signout';

const app = express();
app.use(bodyParser.json());

app.use(currentUserRouter);
app.use(signupRouter);
app.use(siginRouter);
app.use(signoutRouter);


app.listen(3000, () => {
    console.log('auth server started: 3000!');
});



