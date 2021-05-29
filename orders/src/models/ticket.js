import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

const ticketSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    },
    // Format JSON body to send back on the response. 'transform' method is used to modify user document to a custom JSON
    {
        toJSON: {
            transform(doc, ret) {
                // Converting '_id' to 'id' to keep a consistent id reference
                ret.id = ret._id;
                delete ret._id;
            }
        }
    }
);

// Adding OCC version tracking for the Ticket collection
ticketSchema.plugin(updateIfCurrentPlugin);

const Ticket = mongoose.model('Ticket', ticketSchema);

export {Ticket};