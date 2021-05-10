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

    // Defining configurable options
    const options = stan
        // Enabling queue group
        .subscriptionOptions()
        // By setting this, event bus will wait for acknowledgement from the service. If not received after some time, it will send again to another available instance
        .setManualAckMode(true).
        // This flag will tell the event bus to re-deliver all the messages when there's a disconnect between the client and the bus. Note that, this flag will re-send the messages which has been processed and acknowledged by the client if used by itself.
        setDeliverAllAvailable().
        // This flag helps event bus to keep track which messages has been processed (by using the provided id) so that upon re-connect of a service, event bus doesn't re-send messages which has been processed and acknowledged. Note that, it will only work with 'setDeliverAllAvailable' flag applied and queue group name added.
        setDurableName('accounting-service')

    // Name of the topic: ticket:created, queue group: example. Here, by having the same queue group for all the instances of 'listener' event bus, only one will process the message.
    // As a result, only one message will be sent back to the services who are subscribed this queue group
    const subscription = stan.subscribe(
        'ticket:created',
        'example',
        options
);

    // Consuming the message
    subscription.on('message', (msg) => {
        console.log('Message received');
        console.log(
            'Message #' + msg.getSequence() + ', with data: ' + msg.getData()
            );

        // letting event bus know message has been processed
        msg.ack();
    })
});

// When the process is manually closed/interrupted. It will make sure the process closes the client first
// It makes sure when a process is killed, it's acknowledged by the event bus immediately - verify in: http://localhost:8222/streaming/channelsz?subs=1 (NATS Streaming debug online  tool)
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());


class listener {
    constructor(client, qeueGroupName, subject) {
        this.client = client;
        this.qeueGroupName = qeueGroupName
        this.subject = subject
        this.ackWait = 5 * 1000;
        this.onMessage(data, msg)
        {
        }
    }

    subscriptionOptions() {
        return this.client.
            subscriptionOptions().
            setDeliverAllAvailable().
            setDurableName(this.qeueGroupName).
            setManualAckMode(true).
            setAckWait(this.ackWait)
    }

    listen () {
        const subscription = this.client.subscribe(
            this.subject,
            this.qeueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', (msg) => {
             console.log(
            'Message Received: ' + this.subject  + '/' + this.qeueGroupName
             );

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }

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