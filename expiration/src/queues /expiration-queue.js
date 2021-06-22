import Queue from 'bull'
import {ExpirationCompletePublisher} from "../events/expiration-complete-publisher.js";
import {natsWrapper} from "../nats-wrapper.js";

// Create 'expiratioQueue' object based on 'Queue' object
const expirationQueue = new Queue('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
});

// Code to process a job
expirationQueue.process(async (job) => {
        await new ExpirationCompletePublisher(natsWrapper.client()).publish({
            orderId: job.data.orderId
        });
});

export { expirationQueue };


