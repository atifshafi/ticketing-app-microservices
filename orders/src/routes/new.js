import express from "express";
import {
    requireAuth,
    validateRequest,
    NotFoundError,
    BadRequestError
} from '@atiftickets/common'
import {body} from "express-validator";
import {Ticket} from "../models/ticket.js"
import {Order} from "../models/order.js";

const route = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;


// Router handles new order req by an authenticated user
route.post('/api/orders', requireAuth,
    body('ticketId').not().isEmpty().withMessage('TicketId must be provided'),
    validateRequest,
    async (req, res) => {

        const {ticketId} = req.body;
        console.log(ticketId)

        // Find the ticket from DB
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new NotFoundError();
        }

        // Make sure the ticket is not already reserved - Note that, in order for a ticket to be reserved, it needs to be in 'order' collection. Run query to look at all orders. Find an order
        // where the ticket is the ticket we just found *and* the order's status in *not* cancelled. If yes, then ticket is already reserved.
        const existingOrder = await Order.findOne({
            // Mongoose will pull out the id from the document to compare
            ticket: ticket,
            status: {
                // '$in' object in mongoose will look if there's a match for one of the elements from the list in the filters
                $in: [
                    'created',
                    'awaiting:payment',
                    'complete'
                ]
            }
        });
        if (existingOrder) {
            throw new BadRequestError('Ticket is already reserved!');
        }


        // Calculate expiration date for this order
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        // Build the order and save it to the DB
        const order = await Order.create({
            'userId': req.currentUser.id,
            'status': 'created',
            'expiresAt': expiration,
            'ticket': ticket
        });
        // Publish an event saying that an order was created

        res.status(201).send({});

    });

export {route as newOrderRouter};