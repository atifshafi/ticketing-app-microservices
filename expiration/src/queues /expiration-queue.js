import Queue from 'bull'

// Create 'expiratioQueue' object based on 'Queue' object
const expirationQueue = new Queue('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
});

// Code to process a job
expirationQueue.process(async (job) => {
    console.log("I want to publish an expiration:complete event for orderId",
        job.data.orderId
        );
});

export { expirationQueue };


