const mongoose = require("mongoose");

const {Schema} = mongoose;

const event = new Schema(

    {
        event: {
            type: String,
            required: true
        },
        startEvent: {
            type: String,
            required: true
        },
        dateEvent: {
            type: Date,
            required: true
        },
        priceEvent: {
            type: Number
        },
        localNameEvent: {
            type: String,
            required: true
        },
        directionLocalEvent: {
            type: String,
            required: true
        }
    }
)

module.exports = mongoose.model('Event', event);