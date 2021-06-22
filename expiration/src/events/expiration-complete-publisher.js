import {Publisher} from "@atiftickets/common";

// Update this function when needed
export class ExpirationCompletePublisher extends Publisher {
    subject = 'expiration:complete';
}