import 'express-async-errors';
import mongoose from 'mongoose';
import {natsWrapper} from "./nats-wrapper.js";

// Exported 'app.js' instead of keeping contents of 'app.js' here in order to test the service locally and to avoid connecting to the same ports (e.g. 3000) of different services/cloud based services like DB connection
import {app} from './app.js'

const start = async () => {
    // Check if the env variable secret key exists for JWT
    if (!process.env.JWT_KEY) {
        throw new Error([{message: "env variable for JWT doesn't exist"}]);
    }

    // Check if the env variable MONGO_URI exists for JWT
    if (!process.env.MONGO_URI) {
        throw new Error([{message: "env variable for MONGO_URI doesn't exist"}]);
    }

    // Connect to NATS service (event bus)
    await natsWrapper.connect('ticketing', 'njjgutf', 'http://nats-srv:4222');

    // Gracefully close/disconnect client
    natsWrapper.client().on('close', () => {
        console.log('NAT connection closed!');
        process.exit();
    });

    // When the process is manually closed/interrupted. It will make sure the process closes the client first
    // It makes sure when a process is killed, it's acknowledged by the event bus immediately - verify in: http://localhost:8222/streaming/channelsz?subs=1 (NATS Streaming debug online  tool)
    process.on('SIGINT', () => natsWrapper.client().close());
    process.on('SIGTERM', () => natsWrapper.client().close());


    // Verify MongoDB connection
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    console.log("Connected to MongoDB ...");

    app.listen(3000, () => {
        console.log('ticket server started: 3000!');
    });
}

// Start the app
start();