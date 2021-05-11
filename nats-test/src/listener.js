// This script is for producers (services which are going to produce messages and, then, event bus will consume/store it)
import nats from 'node-nats-streaming';
import {randomBytes} from 'crypto';

// Better name would be 'client'. 'stan' is used in the module to refer clients
// Publishers will connect to the event bus using 'node port' forwarding (not via nginx like other services do). This due to the complexity it creates when there's a connection  issue between services and the event bus.
const stan = nats.connect('ticketing', randomBytes(20).toString('hex'), {
    url: 'http://localhost:4222',
});

stan.on('connect', () => {
    console.log('Listener connected to NATS');

    // Gracefully close/disconnect client
    stan.on('close', () => {
        console.log('NAT connection closed!');
        process.exit();
    });

    // Call the listener class to start listening
    new TicketCreatedListener(stan).listen();

});

// When the process is manually closed/interrupted. It will make sure the process closes the client first
// It makes sure when a process is killed, it's acknowledged by the event bus immediately - verify in: http://localhost:8222/streaming/channelsz?subs=1 (NATS Streaming debug online  tool)
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

// This class will be untouched for any topic
class Listener {
    constructor(client, queueGroupName, subject) {
        // Pre-initialized NATS client
        this.client = client;
        // Name of the queue group this listener will join
        this.queueGroupName = queueGroupName
        // Name of the topic
        this.subject = subject
        // Number of seconds this listener has to ack a message
        this.ackWait = 5 * 1000;
        // Function to run when a message is received
        this.onMessage = function (data, msg) {
        }
    }

    // Default subscription option
    subscriptionOptions() {
        return this.client.
        subscriptionOptions().
        setDeliverAllAvailable().
        setDurableName(this.queueGroupName).
        setManualAckMode(true).
        setAckWait(this.ackWait)
    }

    // Cod to setup subscription
    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', (msg) => {
            console.log(
                'Message Received: ' + this.subject + '/' + this.queueGroupName
            );

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }

    // Helper function to parse a message
    parseMessage(msg) {
        const data = msg.getData();
        let parsed_data;
        if (typeof data === 'string') {
            parsed_data = JSON.parse(data);
        } else {
            parsed_data = JSON.parse(data.toString('utf8'));
        }
        return parsed_data


    }


}


// Update this function when needed
class TicketCreatedListener extends Listener {
    subject = 'ticket:created';
    queueGroupName = 'payments-service';

    onMessage = function (data, msg) {
        console.log('event data!', data);

        msg.ack();
    }
}
