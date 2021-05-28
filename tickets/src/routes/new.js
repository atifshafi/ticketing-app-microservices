import express from "express";
import {currentUser, requireAuth, validateRequest} from "@atiftickets/common";
import {body} from "express-validator";
import {Ticket} from "../models/tickets.js";
import {TicketCreatedPublisher} from "../events/ticket-created-publisher.js"
import {natsWrapper} from "../nats-wrapper.js";

const route = express.Router();

// This router will create a ticket (w/ price) for a given user
route.post('/api/tickets', requireAuth,
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({gt: 0}).withMessage('Price must be greater than 0'),
    validateRequest,
    async (req, res) => {

        const {title, price} = req.body;

        console.log('Creating a ticket ...');
        // Create an ticket
        const ticket = await Ticket.create({
            'title': title,
            'price': price,
            'userId': req.currentUser.id
        });


        // Publish a message to let other services know that a ticket has been created
        await new TicketCreatedPublisher(natsWrapper.client()).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId
        });

        res.status(201).send(ticket);

    });

export {route as createNewTicket};