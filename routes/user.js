const express = require("express");

const userController = require("../controllers/user");

const router = express.Router();

router.post("/insertUser", userController.registerUser);

router.post("/loginUser", userController.loginUser);

router.get("/getCredits", userController.getCredits);

module.exports = router;