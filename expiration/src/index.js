import {natsWrapper} from "./nats-wrapper.js";

// Exported 'app.js' instead of keeping contents of 'app.js' here in order to test the service locally and to avoid connecting to the same ports (e.g. 3000) of different services/cloud based services like DB connection

const start = async () => {
    // Check if the env variable NATS_CLUSTER_ID exists
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error([{message: "env variable for NATS_CLUSTER_ID doesn't exist"}]);
    }

    // Check if the env variable NATS_CLIENT_ID exists
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error([{message: "env variable for NATS_CLIENT_ID doesn't exist"}]);
    }

    // Check if the env variable NATS_URL exists
    if (!process.env.NATS_URL) {
        throw new Error([{message: "env variable for NATS_URL doesn't exist"}]);
    }

    // Connect to NATS service (event bus)
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

    // Gracefully close/disconnect client
    natsWrapper.client().on('close', () => {
        console.log('NAT connection closed!');
        process.exit();
    });

    // When the process is manually closed/interrupted. It will make sure the process closes the client first
    // It makes sure when a process is killed, it's acknowledged by the event bus immediately - verify in: http://localhost:8222/streaming/channelsz?subs=1 (NATS Streaming debug online  tool)
    process.on('SIGINT', () => natsWrapper.client().close());
    process.on('SIGTERM', () => natsWrapper.client().close());

}

// Start the app
start();