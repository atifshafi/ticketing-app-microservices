import {Listener, NotFoundError} from "@atiftickets/common";
import {Order} from "../models/order.js";
import {OrderCancelledPublisher} from "./order-cancelled-publisher.js";
import {natsWrapper} from "../nats-wrapper.js";

// Update this function when needed
export class ExpirationCompleteListener extends Listener {
    subject = 'expiration:complete';
    queueGroupName = 'expiration-service';

    onMessage = async function (data, msg) {
        const {orderId} = data;

        // Make a query to 'Order' collection with id provided on the query. 'populate' method stores information about the ticket object to the order object
        let order_status_change = await Order.findById(orderId).populate('ticket');

        // Verify if the order exists
        if (!order_status_change) {
            throw new NotFoundError();
        }

        // Verify if order is complete
        if (order_status_change.status === 'complete') {
            return msg.ack();
        }

        // Mark the order as expired
        order_status_change.set({
            status: 'cancelled'
        });
        await order_status_change.save();

        // Publish an event saying that an order was cancelled
        await new OrderCancelledPublisher(natsWrapper.client()).publish({
            id: order_status_change.id,
            version: order_status_change.version,
            ticket: {
                id: order_status_change.ticket.id
            },
        });

        msg.ack();
    }
}