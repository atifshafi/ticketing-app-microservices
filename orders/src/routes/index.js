import express from "express";
import {requireAuth} from '@atiftickets/common';
import {Order} from "../models/order.js";

const route = express.Router();

//Purpose of this router to get all the order made by a user.
route.get('/api/orders', requireAuth, async (req, res) => {
    // Make a query with userId to fetch all orders from 'Order' collection
    const orders = await Order.find({
        userId: req.currentUser.id
    });
    res.send(orders);

});

export {route as indexOrderRouter};