
const mongoose = require('mongoose');
const { SERVICE_REQUEST_STATE, SERVICE_STATE } = require("../utils/constants");  

const {Schema} = mongoose;

const serviceRequest = new Schema(
    {
        dateRequestService: {
            type: Date,
            required: true
        },
        startRequestService: {
            type: String, 
            required: true
        },
        endRequestService: {
            type: String, 
            required: true
        },
        suggestedPrice: {
            type: Number,
        },
        serviceOwnerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        serviceApplicantId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        serviceId: {
            type: Schema.Types.ObjectId,
            ref: "Service",
            required: true
        },
        ownerState: {
            type: String,
            enum: SERVICE_REQUEST_STATE
        },
        applicantState: {
            type: String,
            enum: SERVICE_REQUEST_STATE
        },
        priceRate: {
            type: Number
        }
    }
)

module.exports = mongoose.model('RequestService', serviceRequest);