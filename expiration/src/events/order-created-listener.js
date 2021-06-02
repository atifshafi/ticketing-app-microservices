import {Listener} from "@atiftickets/common";
import {natsWrapper} from "../nats-wrapper.js";

// Update this function when needed
export class OrderCreatedListener extends Listener {
    subject = 'order:created';
    queueGroupName = 'expiration-service'

    onMessage = async function (data, msg) {
    }
}