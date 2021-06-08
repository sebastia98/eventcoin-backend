const mongoose = require('mongoose');

const { Schema } = mongoose;

const serviceSchema = new Schema(
    {
        offeredServices: {
            type: String,
            required: true,
        },
        rate: {
            type: Number,
            required: true,
        },
        references: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User", 
            required: true
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model('Service', serviceSchema);