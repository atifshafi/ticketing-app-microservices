import nats from 'node-nats-streaming';

// The following is used to establish connection with the event bus. This class is also follows singleton pattern.
class NatsWrapper {
    client() {
        if (!this._client) {
            throw new Error('Cannot connect NATS client before connecting')
        }
        return this._client
    }

    connect(clusterId, clientId, url) {
        this._client = nats.connect(clusterId, clientId, {url});

        return new Promise((resolve, reject) => {
            this.client().on('connect', () => {
                console.log('Listener connected to NATS');
                resolve();
            });
            this.client().on('error', (err) => {
                reject(err);
            });
        });
    }
}

// This instance will be shared between all the files
// Therefore, the object is being created in this file which will be exported and used amongst all other files within the service
// This is the same way 'mongoose' library is used. Note that you are importing a single instance which is used every where which makes it a singleton
export const natsWrapper = new NatsWrapper();