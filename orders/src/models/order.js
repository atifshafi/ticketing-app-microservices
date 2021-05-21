import mongoose from 'mongoose';
import {OrderStatus} from '@atiftickets/common';

// 'ticket' attribute is using Ref/Population feature of Mongoose where it refers to ObjectId of a document in 'Ticket' collection
const orderSchema = new mongoose.Schema({
        userId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            // Enforcing what to expect as a status
            enum: Object.values(OrderStatus),
            default: OrderStatus.Created
        },
        expiresAt: {
            type: mongoose.Schema.Types.Date,
        },
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket'
        }
    },
    // Format JSON body to send back on the response. 'transform' method is used to modify user document to a custom JSON
    {
        toJSON: {
            transform(doc, ret) {
                // Converting '_id' to 'id' to keep a consistent id reference, deleting version and password on the response body
                ret.id = ret._id;
                delete ret._id;
            }
        }
    }
);


const Order = mongoose.model('Order', orderSchema);

export {Order};