import express from "express";
import {Order} from "../models/order.js";
import {requireAuth, NotAuthorizedError, NotFoundError} from "@atiftickets/common";
import {OrderCancelledPublisher} from "../events/order-cancelled-publisher.js";
import {natsWrapper} from "../nats-wrapper.js";

const route = express.Router();

// Purpose of the route is cancel a specific order
route.delete('/api/orders/:orderId', requireAuth, async (req, res) => {
    // Make a query to 'Order' collection with id provided on the query. 'populate' method stores information about the ticket object to the order object
    let order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser.id) {
        throw new NotAuthorizedError();
    }

    // Update order. Note that OCC using 'updateIfCurrentPlugin' can only be implemented when using '.save()'
    // When the mongoose tries to save the document, it essentially makes a request with the version included to find the document (when plug in is included). If there's a version mismatch, it will fail to find the document
    order.set({
            status: 'cancelled'
        });
    await order.save();

    // Publish an event saying that an order was cancelled
    await new OrderCancelledPublisher(natsWrapper.client()).publish({
        id: order.id,
        ticket: {
            id: order.ticket.id
        },
    });

    res.status(204).send(order);

});

export {route as deleteOrderRouter};