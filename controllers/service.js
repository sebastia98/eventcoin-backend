const Service = require("../models/service");
const userController = require("./user");

exports.registerService = (req, res, next) => {
    const {offeredServices, rate, references, description, userId} = req.body;

    console.log(req.body, " => service");

    // TODO: Check propiedades en el server

    const service = new Service({offeredServices, rate, references, description, userId});

    service.save()
        .then(createdService => res.status(201).json({message: "Service registered!", service: createdService}))
}

exports.readServices = (req, res, next) => {
    
    Service.find()
        .then(services => res.status(201).json({serv: services}))
        .catch(error => res.status(500).json({error}))
}