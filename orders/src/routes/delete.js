import express from "express";
import {Order} from "../models/order";
import {requireAuth, NotAuthorizedError, NotFoundError} from "@atiftickets/common";

const route = express.Router();

// Purpose of the route is cancel a specific order
route.delete('/api/orders/:orderId', requireAuth, async (req, res) => {
   // Make a query to 'Order' collection with id provided on the query
    const order = await Order.findById(req.params.orderId);

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser.id) {
        throw new NotAuthorizedError();
    }

    // Update 'status' of the order to 'cancel'


    res.send({});

});

export {route as deleteOrderRouter};