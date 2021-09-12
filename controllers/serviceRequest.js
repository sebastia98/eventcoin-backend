const ServiceRequest = require("../models/serviceRequest");

exports.registerRequestService = (req, res, next) => {

    const {serviceOwnerId, serviceId, serviceApplicantId, ownerState, applicantState, dateRequestService, startRequestService, endRequestService, additionalInfo} = req.body;

    const serviceRequest = new ServiceRequest({serviceOwnerId, serviceId, serviceApplicantId, ownerState, applicantState, dateRequestService, startRequestService, endRequestService, additionalInfo});
    
    try {
        if(serviceOwnerId === serviceApplicantId) {
            throw new Error("You cannot request service from yourself")
        } else if (startRequestService >= endRequestService) {
            throw new Error("Incorrect shcedule")
        } else if (Date.now() >= dateRequestService) {
            throw new Error("Incorrect date")
        } else {
            return serviceRequest.save()
                .then(() => res.status(201).json({message : "Request created", requestCreated : true}))
                .catch(() => res.status(500).json({message : "Any problem with the database", requestCreated : false}))
        }  
    } catch (error) {
        res.status(500).json({message : error.message, requestCreated : false})
    }   
}

exports.readUserOwnerRequests = (req, res, next) => {

    return ServiceRequest.find({serviceOwnerId : req.query.userId})
        .populate("serviceApplicantId")
        .populate("serviceOwnerId")
        .populate("serviceId")
        .then((requests) => {
            res.status(200).json({requests})})
        .catch(error => res.status(500).error({error}))
}

exports.readUserApplicantRequests = (req, res, next) => {
    return ServiceRequest.find({serviceApplicantId : req.query.userId})
        .populate("serviceApplicantId")
        .populate("serviceOwnerId")
        .populate("serviceId")
        .then((requests) => {
            res.status(200).json({requests})})
        .catch(error => res.status(500).json({error}))
}

exports.confirmOwnerRequest = (req, res, next) => {
    console.log(req.body.id)
    ServiceRequest.findById(req.body.id)
        .then(serviceRequest => {
            serviceRequest.ownerState = "done"            
            return serviceRequest.save()
        })
        .then(response => console.log(response._id))
        .catch(error => console.log(error))
}

exports.confirmApplicantRequest = (req, res, next) => {
    console.log(req.body.id)
    ServiceRequest.findById(req.body.id)
        .then(serviceRequest => {
            serviceRequest.applicantState = "done"
            return serviceRequest.save()            
        })
        .then(response => deleteRequest(response))
        .catch(error => console.log(error))
}

deleteRequest = (request) => {
    if(request.ownerState === "done" && request.applicantState === "done") {
        ServiceRequest.deleteOne({_id : request._id})
            .then(response => console.log(response))
            .catch(error => console.log(error))
    }
}


