import express from "express";
import {requireAuth, validateRequest} from '@atiftickets/common'
import {body} from "express-validator";

const route = express.Router();

// Router handles new order req by an authenticated user
route.post('/api/orders', requireAuth,
    body('ticketId').not().isEmpty().withMessage('TicketId must be provided'),
    validateRequest,
    async (req, res) => {
    res.send({});

});

export {route as newOrderRouter};