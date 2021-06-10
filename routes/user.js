const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.post("/insertUser", userController.registerUser);

router.post("/loginUser", userController.loginUser);

module.exports = router;