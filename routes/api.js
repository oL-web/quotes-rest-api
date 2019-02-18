const express = require("express");
const usersRoute = require("./users");
const quotesRoute = require("./quotes");

const router = express.Router();

router.use("/users", usersRoute);
router.use("/quotes", quotesRoute);

module.exports = router;
