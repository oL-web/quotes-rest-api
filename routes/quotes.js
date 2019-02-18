const express = require("express");
const catchWrapper = require("../helpers/catchWrapper");
const quoteController = require("../controllers/quoteController");
const authenticateJWT = require("../middleware/authenticateJWT");

const router = express.Router();

router.get("/", catchWrapper(quoteController.getQuotes));
router.get("/:id", catchWrapper(quoteController.getQuoteById));
router.post("/", authenticateJWT, catchWrapper(quoteController.addQuote));
router.delete("/:id", authenticateJWT, catchWrapper(quoteController.deleteQuoteById));
router.patch("/:id", authenticateJWT, catchWrapper(quoteController.modifyQuote));

module.exports = router;
