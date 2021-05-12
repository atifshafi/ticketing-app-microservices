// This class will be untouched for any topic
export class Publisher {
    constructor(client, subject) {
        // Name of the topic
        this.subject = subject
        this.client = client
    }

    publish(data) {
        // Publishing the message
        // NATS Streaming service only processes string
        return new Promise((resolve, reject) => {
            this.client.publish(this.subject, JSON.stringify(data), (err) => {
                if (err) {
                    return reject(err);
                }
                console.log('Event published to subject: ' + this.subject);
                resolve();
            });
        });
    }

}
