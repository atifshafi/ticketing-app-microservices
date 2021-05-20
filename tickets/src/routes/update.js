import express from "express";
import {requireAuth, NotFoundError, validateRequest, NotAuthorizedError} from "@atiftickets/common";
import {body} from "express-validator";
import {Ticket} from "../models/tickets.js";
import {TicketUpdatedPublisher} from "../events/ticket-updated-publisher.js"
import {natsWrapper} from "../nats-wrapper.js";

const route = express.Router();

// This router will update a ticket based on id
route.put('/api/tickets/:id', requireAuth,
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({gt: 0}).withMessage('Price must be greater than 0'),
    validateRequest,
    async (req, res) => {

        const {title, price} = req.body;

        // Find the ticket by id
        let ticket = await Ticket.findById(req.params.id);

        // Verify if the ticket exists
        if (!ticket) {
            throw new NotFoundError();
        }

        // Verify userId to check ticket owner
        if (ticket.userId !== req.currentUser.id) {
            throw new NotAuthorizedError();
        }

        console.log('Updating a ticket ...');
        // Update ticket
        ticket = await Ticket.updateOne({
            'title': title,
            'price': price
        });

        // Publish a message to let other services know that a ticket has been updated
       new TicketUpdatedPublisher(natsWrapper.client()).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
           userId: ticket.userId
        });

        res.status(200).send(ticket);

    })

export {route as updateTicketRouter};