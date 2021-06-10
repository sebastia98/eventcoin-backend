const express = require("express");

const serivceController = require("../controllers/service");

const router = express.Router();

router.post("/insertService", serivceController.registerService);

router.get("/readServices", serivceController.readServices);

module.exports = router;