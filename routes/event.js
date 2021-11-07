const express = require("express");

const eventController = require("../controllers/event");

const router = express.Router();

router.post("/registerEvent", eventController.registerEvent);

router.get("/readEvents", eventController.readEvents);

module.exports = router;