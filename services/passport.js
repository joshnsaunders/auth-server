const passport = require('passport');
const User = require('../models/user');
const keys = require('../config/keys')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy
const jwt = require('jwt-simple');
const config = require('../config/keys');
const tokenForUser = require('../core/core').tokenForUser;

//const FacebookStrategy = require('passport-facebook').Strategy;

const localOptions = { usernameField: 'email'}
const localLogin = new LocalStrategy (localOptions, (email, password, done) => {
  User.findOne({ email: email }, (err, user) => {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }
      return done(null, user);
    })
  })
})

const googleLogin = new GoogleStrategy (
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: `/auth/google/callback`,
      proxy: false,
    }, async (accessToken, refreshToken, profile, done) => {

      try {
          const existingUser = await User.findOne({ email: profile.emails[0].value })
          if (existingUser){
            const user =
            { token:tokenForUser(existingUser._id),
                user: existingUser,
            }
            return done(null, user)
          }
      }
      catch(err) {
        return done()
      }

      const user = new User ({
        email:profile.emails[0].value,
        loggedInWithGoogle:true
      })
        user.save((err) => {
          if (err) { return next(err); }
        })
        const auth = {token:tokenForUser(user), user}
        return done(null, auth)
    });

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey:keys.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload.sub, (err, user) => {
      if (err) {return done(err, false); }
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);
passport.use(googleLogin);
