import {Listener} from "@atiftickets/common";
import {natsWrapper} from "../nats-wrapper.js";
import {expirationQueue} from "../queues /expiration-queue.js";

// Update this function when needed
export class OrderCreatedListener extends Listener {
    subject = 'order:created';
    queueGroupName = 'expiration-service'

    onMessage = async function (data, msg) {
        // Calculate 'delay' by subtracting 'expiresAt' with current time
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()

        await expirationQueue.add({
            orderId: data.id
        }, {
            delay
        }
        );

        msg.ack();
    }
}