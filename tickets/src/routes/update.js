import express from "express";
import {requireAuth, NotFoundError, BadRequestError, validateRequest, NotAuthorizedError} from "@atiftickets/common";
import {body} from "express-validator";
import {Ticket} from "../models/ticket.js";
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

        // Verify if the ticket has been reserved
        if (ticket.orderId) {
            throw new BadRequestError('Cannot edit a reserved ticket');
        }

        // Verify userId to check ticket owner
        if (ticket.userId !== req.currentUser.id) {
            throw new NotAuthorizedError();
        }

        console.log('Updating a ticket ...');
        // Update ticket. Note that OCC using 'updateIfCurrentPlugin' can only be implemented when using '.save()'
        // When the mongoose tries to save the document, it essentially makes a request with the version included to find the document (when plug in is included). If there's a version mismatch, it will fail to find the document
        ticket.set({
            title: title,
            price: price
        });
        await ticket.save();

        // Publish a message to let other services know that a ticket has been updated
        await new TicketUpdatedPublisher(natsWrapper.client()).publish({
            id: req.params.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            __v: ticket.__v
        });

        res.status(200).send(ticket);

    })

export {route as updateTicketRouter};