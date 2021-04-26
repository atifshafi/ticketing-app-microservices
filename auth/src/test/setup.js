import {MongoMemoryServer}  from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {app} from '../app.js';

let mongo;

// Run before running any test
beforeAll(async () => {
    process.env.JWT_KEY = 'secret_test'

    console.log("test")
    mongo = new MongoMemoryServer.MongoMemoryServer('');
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

// Run before every test
beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

// Run after all the tests are run
afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

