import express from "express";
import {requireAuth, NotFoundError, validateRequest, NotAuthorizedError} from "@atiftickets/common";
import {body} from "express-validator";
import {Ticket} from "../models/tickets.js";

const route = express.Router();

// This router will create a ticket (w/ price) for a given user
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

        res.status(201).send(ticket);

    })

export {route as updateTicketRouter};