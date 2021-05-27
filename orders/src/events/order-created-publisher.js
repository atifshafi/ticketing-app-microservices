import {Publisher} from "@atiftickets/common";

// Update this function when needed
export class OrderCreatedPublisher extends Publisher {
    subject = 'order:created';
}