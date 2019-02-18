const express = require("express");
const catchWrapper = require("../helpers/catchWrapper");
const userController = require("../controllers/userController");
const authenticateJWT = require("../middleware/authenticateJWT");
const authenticateLocal = require("../middleware/authenticateLocal");

const router = express.Router();

router.get("/", catchWrapper(userController.getUsers));
router.post("/", catchWrapper(userController.createUser));
router.get("/:id", catchWrapper(userController.getUserById));
router.delete("/:id", authenticateJWT, catchWrapper(userController.deleteUser));
router.post("/login", authenticateLocal, catchWrapper(userController.loginUser));

module.exports = router;
