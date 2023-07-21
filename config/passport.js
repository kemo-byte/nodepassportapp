const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User Model
const User = require('../models/User');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        // Match User
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(null, false, {
              message: 'That email is not registered !',
            });
          }
          // Match password
          const isMatch = await bcrypt.compare(password, user.password);

          if (isMatch) {
            return done(null, user);
          }
          return done(null, false, { message: 'password incorrect !' });
        } catch (err) {
          return console.log(err);
        }
      },
    ),
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      console.log(err);
    }
  });
};
