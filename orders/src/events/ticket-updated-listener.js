import {Listener, NotFoundError} from "@atiftickets/common";
import {Ticket} from "../models/ticket.js";

// Update this function when needed
export class TicketUpdatedListener extends Listener {
    subject = 'ticket:updated';
    queueGroupName = 'orders-service'

    onMessage = async function (data, msg) {
        const {title, price, id} = data;

        // Find the ticket
        let ticket = await Ticket.findById(id);

        if (!ticket) {
            throw new NotFoundError();
        }

        // Update ticket
        ticket = await Ticket.updateOne(
            {'_id': id},
            {
                $set: {
                    'title': title,
                    'price': price
                }
            });

        msg.ack();
    }
}