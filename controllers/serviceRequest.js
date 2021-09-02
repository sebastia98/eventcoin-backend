const ServiceRequest = require("../models/serviceRequest");

exports.registerRequestService = (req, res, next) => {
    const {serviceOwnerId, serviceId, serviceApplicantId, ownerState, applicantState, dateRequestService, startRequestService, endRequestService, additionalInfo} = req.body;

    console.log("hola");

    const serviceRequest = new ServiceRequest({serviceOwnerId, serviceId, serviceApplicantId, ownerState, applicantState, dateRequestService, startRequestService, endRequestService, additionalInfo});

    return serviceRequest.save()
        .then(createdRequest => res.status(201).json(createdRequest))
        .catch(() => res.status(500).json({message : "problems"}))
}