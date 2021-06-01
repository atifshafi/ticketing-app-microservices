import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

// 'ticket' attribute is using Ref/Population feature of Mongoose where it refers to ObjectId of a document in 'Ticket' collection
const orderSchema = new mongoose.Schema({
        userId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
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

// Adding OCC version tracking for the Orders collection (not needed at the moment)
orderSchema.plugin(updateIfCurrentPlugin);


const Order = mongoose.model('Order', orderSchema);

export {Order};