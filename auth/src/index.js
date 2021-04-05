import express from 'express';
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.get('/api/users/currentuser', (req, res) => {
    res.send("Hello!");
});

app.listen(3000, () => {
    console.log('auth server started: 3000!');
});



