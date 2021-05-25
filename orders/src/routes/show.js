import express from "express";
import {requireAuth, NotFoundError, NotAuthorizedError} from '@atiftickets/common';
import {Order} from "../models/order.js";

const route = express.Router();

// Purpose of this router to fetch a specific order for a user
route.get('/api/orders/:orderId', requireAuth, async (req, res) => {
    // Make a query to 'Order' collection with id provided on the query
    const order = await Order.findById(req.params.orderId);

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser.id) {
        throw new NotAuthorizedError();
    }

    res.send({order});

});

export {route as showOrderRouter};