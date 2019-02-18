const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports = {
  async getUsers(req, res) {
    const users = await User.find();
    res.json(users);
  },
  async getUserById(req, res) {
    const user = await User.findById(req.params.id);
    if (!user) res.status(404).json({ msg: "User doesn't exist!" });
    else res.json(user);
  },
  async createUser(req, res) {
    const user = new User(req.body);
    await User.register(user, req.body.password);
    res.status(201).json({ msg: "User created!", id: user.id });
  },
  async deleteUser(req, res) {
    const { id } = req.params;
    if (req.user.id !== id) return res.status(401).json({ msg: "You can only delete your own account!" });
    const user = await User.findByIdAndRemove(id);

    if (!user) res.status(404).json({ msg: "User doesn't exist!" });
    else res.json({ msg: "User deleted!" });
  },
  async loginUser(req, res) {
    const token = jwt.sign({ id: req.user._id }, JWT_SECRET, { expiresIn: "6h" });
    res.json({ msg: "Logged in!", token });
  }
};
