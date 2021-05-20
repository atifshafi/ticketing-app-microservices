import {Publisher} from "@atiftickets/common";

// Update this function when needed
export class TicketCreatedPublisher extends Publisher {
    subject = 'ticket:created';
}