import {Publisher} from "./base-publisher.js";

// Update this function when needed
export class TicketCreatedPublisher extends Publisher {
    subject = 'ticket:created';
}