import {Listener, NotFoundError} from "@atiftickets/common";
import {Ticket} from "../models/ticket.js";
import {TicketUpdatedPublisher} from "./ticket-updated-publisher.js";
import {natsWrapper} from "../nats-wrapper.js";

// Update this function when needed
export class OrderCancelledListener extends Listener {
    subject = 'order:cancelled';
    queueGroupName = 'tickets-service'

    onMessage = async function (data, msg) {
        const {ticket} = data;

        // Find the ticket based on id
        let ticket_not_res = await Ticket.findById(ticket.id);

        // Throw an error if ticket is not found
        if (!ticket_not_res) {
            throw new NotFoundError();
        }

        // Mark the ticket as NOT reserved
        ticket_not_res.set({
            orderId: undefined
        });
        await ticket_not_res.save();


        // Publish a message to let ticket service know about the updated version
        await new TicketUpdatedPublisher(natsWrapper.client()).publish({
            id: ticket_not_res.id,
            title: ticket_not_res.title,
            price: ticket_not_res.price,
            userId: ticket_not_res.userId,
            orderId: ticket_not_res.orderId,
            __v: ticket_not_res.__v
        });

        msg.ack();
    }
}