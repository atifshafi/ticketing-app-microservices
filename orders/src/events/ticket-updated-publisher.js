import {Publisher} from "@atiftickets/common";

// Update this function when needed
export class TicketUpdatedPublisher extends Publisher {
    subject = 'ticket:updated';
}