const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require("../models/User");

const passportConfig = () => {
  const config = {
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  };

  const cb = (payload, done) =>
    User.findById(payload.id)
      .then(user => done(null, user))
      .catch(err => done(err));

  passport.use(User.createStrategy());
  passport.use(new passportJWT.Strategy(config, cb));
};

module.exports = passportConfig;
