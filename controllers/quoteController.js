const Quote = require("../models/Quote");

module.exports = {
  async getQuotes(req, res) {
    const quotes = await Quote.find();
    res.json(quotes);
  },
  async getQuoteById(req, res) {
    const quote = await Quote.findById(req.params.id);
    if (!quote) res.status(404).json({ msg: "Quote doesn't exist!" });
    else res.json(quote);
  },
  async addQuote(req, res) {
    const quote = await Quote.create(req.body);
    res.status(201).json({ msg: "Quote created!", id: quote.id });
  },
  async deleteQuoteById(req, res) {
    const quote = await Quote.findByIdAndRemove(req.params.id);

    if (!quote) res.status(404).json({ msg: "Quote doesn't exist!" });
    else res.json({ msg: "Quote deleted!" });
  },
  async modifyQuote(req, res) {
    await Quote.findByIdAndUpdate(req.params.id, req.body);
    res.json({ msg: "Quote modified!" });
  }
};
