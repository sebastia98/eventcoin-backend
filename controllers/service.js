const Service = require("../models/service");
const ServiceRequest = require("../models/serviceRequest")

const cleanSearchText = (text) =>
  text
    .replace(/a|á/g, '[aá]')
    .replace(/e|é/g, '[eé]')
    .replace(/i|í/g, '[ií]')
    .replace(/o|ó/g, '[oó]')
    .replace(/u|ú/g, '[uú]');

exports.registerService = (req, res, next) => {
    const {offeredServices, rate, references, description, userId} = req.body;

    const service = new Service({offeredServices, rate, references, description, userId});

    return service.save()
        .then(createdService => {
            if(Object.keys(createdService).length === 0) {
                throw new Error();
            }
            return res.status(201).json({message: "Service registered!", service: createdService})
        })
        .catch(error => res.status(500).json({error}))
    }

exports.editService = (req, res, next) => {

    const {offeredServices, rate, references, description} = req.body;
    
    return Service.findById(req.body._id)
        .then(service => {
            service.offeredServices = offeredServices;
            service.rate = rate;
            service.references = references;
            service.description = description;

            return service.save();
        })
        .then(updatedService => res.status(201).json({message: "Service updated!", service: updatedService}));    
}

exports.readServices = (req, res, next) => {

    const {filter} = req.query;
    const params = {};

    if(filter) {
        params.offeredServices = { $regex: cleanSearchText(filter), $options: 'i' };
    }
    
    return Service.find(params)
        .populate('userId')
        .then(services => res.status(200).json({serv: services}))
        .catch(error => res.status(500).json({error}))
}

exports.readUserServices = (req, res, next) => {

    return Service.find({userId : req.query.userId})
        .populate('userId')
        .then(services => res.status(200).json({serv: services}))
        .catch(error => res.status(500).json({error}))
}

exports.deleteService = (req, res, next) =>
    Service.deleteOne({_id : req.body._id})
        .then(() => ServiceRequest.deleteMany({serviceId : req.body._id}))
        .then(() => console.log("All requests deleted"))
        .then(() => console.log("Service deleted"))
        .catch(error => res.status(500).json({error}))

exports.obtainService = (req, res, next) => {
    return Service.findById(req.query.id)
        .populate('userId')
        .then(service => res.status(200).json({service}))
        .catch(error => res.status(500).json({error}))
}   

