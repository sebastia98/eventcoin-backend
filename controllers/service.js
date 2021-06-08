const Service = require("../models/service");

exports.registerService = (req, res, next) => {
    const {offeredServices, rate, references, description, userId} = req.body;

    console.log(req.body, " => service");

    // TODO: Check propiedades en el server

    const service = new Service({offeredServices, rate, references, description, userId});

    return service.save().then((createdService) => {
        res.status(201).json({message: "Service registered!",
                              service: createdService});
        return createdService;
    })

}