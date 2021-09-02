const express = require("express");

const serviceRequestController = require("../controllers/serviceRequest");

const router = express.Router();

router.post("/registerRequestService", serviceRequestController.registerRequestService);

module.exports = router;