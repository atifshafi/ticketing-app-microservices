import express from "express";
import {requireAuth, validateRequest, NotFoundError} from '@atiftickets/common'
import {body} from "express-validator";
import {Ticket} from "../models/ticket.js"

const route = express.Router();

// Router handles new order req by an authenticated user
route.post('/api/orders', requireAuth,
    body('ticketId').not().isEmpty().withMessage('TicketId must be provided'),
    validateRequest,
    async (req, res) => {

        const {ticketId} = req.body;

        // Find the ticket from DB
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new NotFoundError();
        }

        // Make sure the ticket is not already reserved

        // Build the order and save it to the DB

        // Publish an event saying that an order was created

    res.send({});

});

export {route as newOrderRouter};