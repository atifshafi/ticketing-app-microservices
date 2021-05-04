import express from "express";
import {requireAuth} from "@atiftickets/common";
import {body} from "express-validator";
import {validateRequest, BadRequestError} from '@atiftickets/common'

const route = express.Router();

// This router will clear up any jwt associated with a session
route.post('/api/tickets', requireAuth,
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt:0 }).withMessage('Price must be greater than 0'),
    async (req,res) =>{

    res.sendStatus(200).send({});
})

export { route as createNewTicket };