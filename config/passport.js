const FortyTwoStrategy = require("passport-42").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("./keys");

// Load user model
const User = mongoose.model("users");

module.exports = passport => {
  passport.use(
    new FortyTwoStrategy(
      {
        clientID: keys.FortyTwoClientID,
        clientSecret: keys.FortyTwoClientSecret,
        callbackURL: "/auth/42/callback"
      },
      (accessToken, refreshToken, profile, done) => {
        const newUser = {
          userID: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value
        };

        // Check for existing user
        User.findOne({
          userID: profile.id
        }).then(user => {
          if (user) {
            // return user
            done(null, user);
          } else {
            // Create user
            new User(newUser).save().then(user => done(null, user));
          }
        });
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.GoogleClientID,
        clientSecret: keys.GoogleClientSecret,
        callbackURL: "/auth/google/callback"
      },
      (accessToken, refreshToken, profile, done) => {
        const newUser = {
          userID: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value
        };

        // Check for existing user
        User.findOne({
          userID: profile.id
        }).then(user => {
          if (user) {
            // return user
            done(null, user);
          } else {
            // Create user
            new User(newUser).save().then(user => done(null, user));
          }
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
};
