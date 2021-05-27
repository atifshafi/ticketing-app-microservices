import {Publisher} from "@atiftickets/common";

// Update this function when needed
export class OrderCancelledPublisher extends Publisher {
    subject = 'order:cancelled';
}