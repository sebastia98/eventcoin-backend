const express = require("express");

const serivceController = require("../controllers/service");

const router = express.Router();

router.post("/insertService", serivceController.registerService);

module.exports = router;