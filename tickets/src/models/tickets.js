import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    },
    // Format JSON body to send back on the response. 'transform' method is used to modify user document to a custom JSON
    {
        toJSON: {
            transform(doc, ret) {
                // Converting '_id' to 'id' to keep a consistent id reference, deleting version and password on the response body
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);



const Ticket = mongoose.model('Ticket', ticketSchema);

export {Ticket};