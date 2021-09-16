const express = require("express");

const serviceRequestController = require("../controllers/serviceRequest");

const router = express.Router();

router.post("/registerRequestService", serviceRequestController.registerRequestService);

router.get("/readUserOwnerRequests", serviceRequestController.readUserOwnerRequests)

router.get("/readUserApplicantRequests", serviceRequestController.readUserApplicantRequests)

router.get("/obtainServiceRequests", serviceRequestController.obtainServiceRequests)

router.post("/confirmOwnerRequest", serviceRequestController.confirmOwnerRequest)

router.post("/confirmApplicantRequest", serviceRequestController.confirmApplicantRequest)

router.post("/rejectRequest", serviceRequestController.rejectRequest)

router.delete("/deleteRequest", serviceRequestController.deleteRequestRejected)

module.exports = router;