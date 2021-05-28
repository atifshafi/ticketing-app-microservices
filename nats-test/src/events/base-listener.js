// This class will be untouched for any topic
export class Listener {
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
        return this.client.subscriptionOptions().setDeliverAllAvailable().setDurableName(this.queueGroupName).setManualAckMode(true).setAckWait(this.ackWait)
    }

    // Code to setup subscription
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
