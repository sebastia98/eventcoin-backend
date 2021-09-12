const express = require("express");

const serviceRequestController = require("../controllers/serviceRequest");

const router = express.Router();

router.post("/registerRequestService", serviceRequestController.registerRequestService);

router.get("/readUserOwnerRequests", serviceRequestController.readUserOwnerRequests)

router.get("/readUserApplicantRequests", serviceRequestController.readUserApplicantRequests)

router.post("/confirmOwnerRequest", serviceRequestController.confirmOwnerRequest)

router.post("/confirmApplicantRequest", serviceRequestController.confirmApplicantRequest)

module.exports = router;