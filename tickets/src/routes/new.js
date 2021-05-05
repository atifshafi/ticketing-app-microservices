import express from "express";
import {currentUser, requireAuth, validateRequest} from "@atiftickets/common";
import {body} from "express-validator";
import {Ticket} from "../models/tickets.js";

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

        res.status(201).send(ticket);

    })

export {route as createNewTicket};