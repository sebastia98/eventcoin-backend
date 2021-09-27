const ServiceRequest = require("../models/serviceRequest");
const User = require("../models/user")
const Service = require("../models/service");
const serviceRequest = require("../models/serviceRequest");
const { request } = require("express");

exports.registerRequestService = (req, res, next) => {  
    const serviceRequest = new ServiceRequest({...req.body});
        isValidRequestService(serviceRequest)
            .then((totalPrice) => {
                serviceRequest.priceRate = totalPrice
                return serviceRequest.save()
            })
            .then(() => res.status(201).json({message : "Request created", requestCreated : true}))
            .catch((error) => res.status(500).json({message : error.message, requestCreated : false}))        
    }

const isValidRequestService = ({dateRequestService, startRequestService, endRequestService, serviceOwnerId, serviceApplicantId, serviceId}) => 
    new Promise((resolve, reject) => {
        isRequestServiceFullField(dateRequestService, startRequestService, endRequestService);
        isSameUser(serviceOwnerId, serviceApplicantId);
        isInvalidDate(dateRequestService);
        return isOverSchedule(startRequestService, endRequestService, dateRequestService)
            .then(() => areCreditsEnough(serviceId, serviceApplicantId, startRequestService, endRequestService))
            .then((totalPrice) => resolve(totalPrice))
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

const areCreditsEnough = (serviceId, userId, startRequestService, endRequestService) => 
    new Promise ((resolve, reject) => {
        Service.findById(serviceId)
            .then(service => {
                User.findById(userId)
                    .then(user => {
                        const workedHours = calculateHours(endRequestService, startRequestService);
                        const totalPrice = service.rate * workedHours
                        if(totalPrice > user.credits) {
                            reject(new Error("You don't have enough credits"))
                        } else {
                            user.credits -= totalPrice
                            user.save()
                                .then(resolve(totalPrice)) 
                                .catch(reject(new Error("You have problems")))
                        }                            
                    })
                    .catch(() => reject(new Error("You have problems")))
            })
            .catch(() => reject(new Error("You have problems")))
    })

const calculateHours = (endRequestService, startRequestService) => {
    return Number(endRequestService.substr(0, 2)) - Number(startRequestService.substr(0, 2))
}

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
    ServiceRequest.findById(req.body.id)
        .then(serviceRequest => {
            serviceRequest.ownerState = "done"            
            return serviceRequest.save()
        })
        .then(response => performConfirmedRequest(response))
        .catch(error => console.log(error))
}

exports.rejectRequest = (req, res, next) => {
    ServiceRequest.findById(req.body.id)
        .then(serviceRequest => {
            serviceRequest.ownerState = "rejected"
            return serviceRequest.save()
        })
        .catch(error => console.log(error))
}

exports.confirmApplicantRequest = (req, res, next) => {
    ServiceRequest.findById(req.body.id)
        .then(serviceRequest => {
            serviceRequest.applicantState = "done"
            return serviceRequest.save()            
        })
        .then(response => performConfirmedRequest(response))
        .catch(error => console.log(error))
}

exports.deleteRequestRejected = (req, res, next) => {
    ServiceRequest.findById(req.body.id)
        .then(request => deleteRequest(request))
        .catch(error => console.log(error)) 

}

const performConfirmedRequest = (request) => {
    if(request.ownerState === "done" && request.applicantState === "done") {
        User.findById(request.serviceOwnerId) 
            .then(user => {
                console.log(user)
                console.log(request.priceRate)
                user.credits += request.priceRate
                return user.save()
            })
            .then(() => User.findById(request.serviceApplicantId))
            .then(user => {
                console.log(user)
                console.log(request.priceRate)
                user.credits -= request.priceRate
                return user.save()  
            })
            .then(() => deleteRequest(request))
            .catch(error => console.log(error))
        
        
    }
}

const deleteRequest = (request) => {
    console.log(request)
        ServiceRequest.deleteOne({_id : request._id})
            .then(response => console.log(response))
            .catch(error => console.log(error))
}



