import {Listener, NotFoundError} from "@atiftickets/common";
import {Ticket} from "../models/ticket.js";

// Update this function when needed
export class TicketUpdatedListener extends Listener {
    subject = 'ticket:updated';
    queueGroupName = 'orders-service'

    onMessage = async function (data, msg) {
        const {title, price, id, __v} = data;

        // Find the ticket based on id and version number. If the version number found on this 'Ticket' collection is not in order, then the message will declined
        // If ticket not found, since the event was not acknowledged by the order server, event bus will re-send it in every 15s
        const ticket = await Ticket.findOne({
            _id: id,
            __v: __v - 1
        });


        if (!ticket) {
            throw new NotFoundError();
        }

        // Update ticket
        // ticket = await Ticket.updateOne(
        //     {'_id': id},
        //     {
        //         $set: {
        //             'title': title,
        //             'price': price,
        //         }
        //     });

        ticket.set({
            title: title,
            price: price
        });
        await ticket.save();

        msg.ack();
    }
}