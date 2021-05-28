import {Listener} from "@atiftickets/common";
import {Ticket} from "../models/ticket.js";

// Update this function when needed
export class TicketCreatedListener extends Listener {
    subject = 'ticket:created';
    queueGroupName = 'orders-service';

    onMessage = async function (data, msg) {
        const {title, price, id} = data;

        // Create a ticket doc. id included to keep the id consistent between two 'Ticket' collections
        await Ticket.create({
            '_id': id,
            'title': title,
            'price': price
        });

        msg.ack();
    }
}