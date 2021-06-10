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

exports.readServices = (req, res, next) => {

    const services = Service.find()
                                .then(products => {
                                    return products;
                                }).catch((err) => {
                                    console.log(err)
                                })
    services.then((services) => {
                console.log(services);
                res.send({serv: services})
            })
            .catch((error) => {
                res.status(500).send(error);
            })
}