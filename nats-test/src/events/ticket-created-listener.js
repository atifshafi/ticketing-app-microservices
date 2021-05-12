import {Listener} from "./base-listener.js";

// Update this function when needed
export class TicketCreatedListener extends Listener {
    subject = 'ticket:created';
    queueGroupName = 'payments-service';

    onMessage = function (data, msg) {
        console.log('event data!', data);

        msg.ack();
    }
}