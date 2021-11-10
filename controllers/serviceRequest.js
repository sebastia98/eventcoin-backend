const ServiceRequest = require("../models/serviceRequest");
const User = require("../models/user")
const Service = require("../models/service");
const { response } = require("express");

exports.registerRequestService = (req, res, next) => { 
    const serviceRequest = new ServiceRequest({...req.body});
        console.log(serviceRequest)
        isValidRequestService(serviceRequest)
            .then((totalPrice) => {
                if(serviceRequest.suggestedPrice) {
                    serviceRequest.applicantState = "negotiated"
                    serviceRequest.ownerState = "pennding"
                } else {
                    serviceRequest.applicantState = "pennding"
                    serviceRequest.ownerState = "pennding"
                }
                serviceRequest.priceRate = totalPrice
                return serviceRequest.save()
            })
            .then((request) => {
                console.log("Request created")
                res.status(201).json({message : "Request created", requestCreated : request})})
            .catch((error) => res.status(500).json({message : error.message, requestCreated : false}))        
    }

const isValidRequestService = ({dateRequestService, startRequestService, endRequestService, serviceOwnerId, serviceApplicantId, serviceId, suggestedPrice}) => 
    new Promise((resolve, reject) => {
        isRequestServiceFullField(dateRequestService, startRequestService, endRequestService);
        isSameUser(serviceOwnerId, serviceApplicantId);
        isInvalidDate(dateRequestService);
        isInvalidSchedule(startRequestService, endRequestService)
        isSuggestedPriceNegative(suggestedPrice);
        return isOverSchedule(startRequestService, endRequestService, dateRequestService)
            .then(() => areCreditsEnough(serviceId, serviceApplicantId, startRequestService, endRequestService, suggestedPrice))
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

const isSuggestedPriceNegative = (suggestedPrice) => {
    if (suggestedPrice <= 0) {
        throw new Error("The suggested price must been bigger than zero")
    }
}

const isInvalidSchedule = (startRequestService, endRequestService) => {
    if (startRequestService > endRequestService) {
        throw new Error("Is invalid schedule")
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

const areCreditsEnough = (serviceId, userId, startRequestService, endRequestService, suggestedPrice) => 
    new Promise ((resolve, reject) => {
        Service.findById(serviceId)
            .then(service => {
                User.findById(userId)
                    .then(user => {
                        const workedHours = calculateHours(endRequestService, startRequestService);
                        let totalPrice = 0
                        if(suggestedPrice) {
                            totalPrice = suggestedPrice * workedHours
                        } else {
                            totalPrice = service.rate * workedHours    
                        }
                        if(totalPrice > user.credits) {
                            reject(new Error("You don't have enough credits"))
                        } else {
                            user.credits -= totalPrice
                            user.save()
                                .then(resolve(totalPrice)) 
                                .catch(reject(new Error("You have problems")))
                        }                            
                    })
                    .catch((error) => console.log(error))
            })
            .catch((error) => reject(console.log(error)))
    })

const calculateHours = (endRequestService, startRequestService) => {
    return Number(endRequestService.substr(0, 2)) - Number(startRequestService.substr(0, 2))
}

exports.obtainServiceRequests = (req, res, next) => {
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
        .catch(error => res.status(500).json({error}))
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
        .then((response) => res.status(200).json({response}))
        .catch(error => reject(error))
}

exports.rejectRequest = (req, res, next) => {
    ServiceRequest.findById(req.body.id)
        .then(serviceRequest => {
            serviceRequest.ownerState = "rejected"
            return serviceRequest.save()
        })
        .then((response) => res.status(200).json({response}))
        .catch(error => console.log(error))
}

exports.confirmApplicantRequest = (req, res, next) => {
    ServiceRequest.findById(req.body.id)
        .then(serviceRequest => {
            serviceRequest.applicantState = "done"
            return serviceRequest.save()            
        })
        .then(response => performConfirmedRequest(response))
        .then((response) => res.status(200).json({response}))
        .catch(error => reject(error))
    }

exports.deleteRequestRejected = (req, res, next) => {
    ServiceRequest.findById(req.body.id)
        .then(request => deleteRequest(request))
        .then(response => res.status(200).json({response}))
        .catch(error => reject(error)) 

}

const performConfirmedRequest = (request) => 

    new Promise((resolve, reject) => {
        if(request.ownerState === "done" && request.applicantState === "done") {
            User.findById(request.serviceOwnerId) 
                .then(user => {
                    user.credits += request.priceRate
                    return user.save()
                })
                .then(() => deleteRequest(request))
                .then(() => resolve(request))
                .catch(error => reject(error))        
        } else {
            resolve(request)
        }
    })


const deleteRequest = (request) => 
    new Promise((resolve, reject) => {
        User.findById(request.serviceApplicantId)
            .then((user) => {
                if(request.ownerState === "rejected") {
                    user.credits += request.priceRate
                }
                return user.save()
            })
            .then(() => ServiceRequest.deleteOne({_id : request._id}))
            .then(() => {
                resolve()
            })
            .catch(error => reject(error))
    })
    



