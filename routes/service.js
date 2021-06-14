const express = require("express");

const serivceController = require("../controllers/service");

const router = express.Router();

router.post("/insertService", serivceController.registerService);

router.post("/editService", serivceController.editService);

router.get("/readServices", serivceController.readServices);

router.get("/readUserServices", serivceController.readUserServices);

router.get("/obtainService", serivceController.obtainService);

router.delete("/deleteService", serivceController.deleteService);

module.exports = router;