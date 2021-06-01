import express from "express";
import {Ticket} from "../models/ticket.js";

const route = express.Router();

// This router to fetch all the available tickets
route.get('/api/tickets',
    async (req, res) => {
        const tickets = await Ticket.find({});
        res.status(200).send(tickets);
    });

export {route as indexTicketsRouter};