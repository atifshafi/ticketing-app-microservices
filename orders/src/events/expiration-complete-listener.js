import {Listener} from "@atiftickets/common";
import {Ticket} from "../models/ticket.js";
import {Order} from "../models/order.js";

// Update this function when needed
export class ExpirationCompleteListener extends Listener {
    subject = 'expiration:complete';
    queueGroupName = 'expiration-service';

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