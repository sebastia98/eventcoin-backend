const ServiceRequest = require("../models/serviceRequest");
const User = require("../models/user")
const Service = require("../models/service");
const serviceRequest = require("../models/serviceRequest");
const { request } = require("express");

exports.registerRequestService = (req, res, next) => {  
    const serviceRequest = new ServiceRequest({...req.body});
        isValidRequestService(serviceRequest)
            .then(() => serviceRequest.save())
            .then(() => res.status(201).json({message : "Request created", requestCreated : true}))
            .catch((error) => res.status(500).json({message : error.message, requestCreated : false}))        
    }

const isValidRequestService = ({dateRequestService, startRequestService, endRequestService, serviceOwnerId, serviceApplicantId}) => 
    new Promise((resolve, reject) => {
        isRequestServiceFullField(dateRequestService, startRequestService, endRequestService);
        isSameUser(serviceOwnerId, serviceApplicantId);
        isInvalidDate(dateRequestService);
        return isOverSchedule(startRequestService, endRequestService, dateRequestService)
            .then(() => resolve())
            .catch(error => reject(error))
    })
    
const isRequestServiceFullField = (dateRequestService, startRequestService, endRequestService) => {
    if(!dateRequestService || !startRequestService || !endRequestService) {
        throw new Error("Fill in the fields")
    }
}

const isSameUser = (serviceOwnerId, serviceApplicantId) => {
    if(serviceOwnerId.equals(serviceApplicantId)) {
        throw new Error("You cannot request service from yourself")
    }
}

const isInvalidDate = (dateRequestService) => {
    if (new Date(Date.now()) >= new Date(dateRequestService)) {
        throw new Error("Incorrect date")
    } 
}


const isOverSchedule = (startRequestService, endRequestService, dateRequestService) => 
    new Promise ((resolve, reject) => {
        ServiceRequest.find({dateRequestService})
            .then(requests => {
                const isInvalid = requests.some(request => { 
                    if (request.startRequestService < endRequestService && request.endRequestService > startRequestService) {
                        return true;
                    }
                })
                if(isInvalid) {
                    reject(new Error("Is bussy"))
                }
                resolve()
            })
    })
    

exports.obtainServiceRequests = (req, res, next) => {
    console.log(req.query)
    return ServiceRequest.find({serviceId : req.query.serviceId})
        .then(requests => res.status(200).json({requests}))
        .catch(error => res.status(500).json({message : error.message}))
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
        .then(response => deleteConfirmedRequest(response))
        .catch(error => console.log(error))
}

exports.rejectRequest = (req, res, next) => {
    ServiceRequest.findById(req.body.id)
        .then(serviceRequest => {
            console.log("Hola")
            serviceRequest.ownerState = "rejected"
            return serviceRequest.save()
        })
        .catch(error => console.log(error))
}

exports.confirmApplicantRequest = (req, res, next) => {
    console.log(req.body.id)
    ServiceRequest.findById(req.body.id)
        .then(serviceRequest => {
            serviceRequest.applicantState = "done"
            return serviceRequest.save()            
        })
        .then(response => deleteConfirmedRequest(response))
        .catch(error => console.log(error))
}

exports.deleteRequestRejected = (req, res, next) => {
    console.log(req.body)
    ServiceRequest.findById(req.body.id)
        .then(request => deleteRequest(request))
        .catch(error => console.log(error)) 

}

const deleteConfirmedRequest = (request) => {

    const subtract = new Date("2000-01-01T" + request.endRequestService + ":00") - new Date("2000-01-01T" + request.startRequestService + ":00")
    const workedHours = new Date(subtract).getHours()

    if(request.ownerState === "done" && request.applicantState === "done") {
        deleteRequest(request)
    }
}

const deleteRequest = (request) => {
    console.log(request)
        ServiceRequest.deleteOne({_id : request._id})
            .then(response => console.log(response))
            .catch(error => console.log(error))
}



