const Event = require("../models/event")

exports.registerEvent = (req, res, next) => {
    const event = new Event({...req.body})
    
    return event.save()
        .then((event) => {
            console.log("Event created")
            res.status(201).json({eventCreated : event})})
        .catch((error) => res.status(500).json({message : error.message}))
}

exports.readEvents = (req, res, next) => {
    
    return Event.find()
        .then(events => res.status(200).json({events}))
        .catch(error => res.status(500).json({error}))
}