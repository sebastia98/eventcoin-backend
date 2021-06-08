const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.post("/insertUser", userController.registerUser)

module.exports = router;