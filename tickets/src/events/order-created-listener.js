import {Listener, NotFoundError} from "@atiftickets/common";
import {Ticket} from "../models/ticket.js";
import {TicketUpdatedPublisher} from "./ticket-updated-publisher.js";
import {natsWrapper} from "../nats-wrapper.js";

// Update this function when needed
export class OrderCreatedListener extends Listener {
    subject = 'order:created';
    queueGroupName = 'tickets-service'

    onMessage = async function (data, msg) {
        const {id, ticket} = data;

        // Find the ticket based on id
        let ticket_res = await Ticket.findById(ticket.id);

        // Throw an error if ticket is not found
        if (!ticket_res) {
            throw new NotFoundError();
        }

        // Mark the ticket as reserved
        ticket_res.set({
            orderId: id
        });
        await ticket_res.save();


        // Publish a message to let ticket service know about the updated version
        await new TicketUpdatedPublisher(natsWrapper.client()).publish({
            id: ticket_res.id,
            title: ticket_res.title,
            price: ticket_res.price,
            userId: ticket_res.userId,
            orderId: ticket_res.orderId,
            __v: ticket_res.__v
        });

        msg.ack();
    }
}