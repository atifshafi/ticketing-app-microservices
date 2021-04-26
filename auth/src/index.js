import 'express-async-errors';
import mongoose from 'mongoose';

// Exported 'app.js' instead of keeping contents of 'app.js' here in order to test the service locally and to avoid connecting to the same ports (e.g. 3000) of different services/cloud based services like DB connection
import {app} from './app.js'

const start = async () => {
    // Check if the env variable secret key exists for JWT
    if (!process.env.JWT_KEY) {
        throw new Error([{message: "env variable for JWT doesn't exist"}])
    }
    // Verify MongoDB connection
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

// Start the app
start();