const passport = require('passport');
const User = require('../models/user');
const keys = require('../config/keys')
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy

const jwt = require('jwt-simple');
//const User = require('../models/user');
const config = require('../config/keys');

const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub:user.id, iat: timestamp }, config.secret);
}

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
      const existingUser = await User.findOne({ email: profile.emails[0].value });
      const user = {token:tokenForUser(existingUser._id)}
      console.log('profile', user);
      done(null, user.token)
    }
    // async (accessToken, refreshToken, profile, done) => {
    //   console.log('accessToken', accessToken);
    //   console.log('refreshToken', refreshToken);
    //   console.log('profile', profile);
    // console.log('email', profile.emails[0].value);

    // async (accessToken, refreshToken, profile, done) => {
    //   const existingUser = await User.findOne({ email: profile.emails[0].value });
    //   console.log('EXISTING', existingUser);
    //   if (existingUser) {
    //     return done(null, existingUser);
    //   }
    //
    //   const user = await new User({ email: profile.emails[0].value }).save();
    //   return done(null, user);
    //
  );


// const GoogleLogin = new GoogleStrategy(
//     {
//       clientID: keys.googleClientID,
//       clientSecret: keys.googleClientSecret,
//       callbackURL: '/auth/google/callback',
//       proxy: true
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       const existingUser = await User.findOne({ googleId: profile.id });
//
//       if (existingUser) {
//         //log existingUser
//         return done(null, existingUser);
//       }
//
//       const user = await new User({ googleId: profile.id }).save();
//       done(null, user);
//     }
//   )

// const facebookLogin = new FacebookStrategy ((email, done) => {
//   User.findOne({ email: email}, (err, user) => {
//     if (err) {return done(err); }
//     if (!user) {return done(null, false); }
//
//     return done(null, user);
//   })
// })

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

// const FacebookStrategy = require('passport-facebook').Strategy;
// const mongoose = require('mongoose');
//
// const User = mongoose.model('user');
//
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });
//
// passport.deserializeUser((id, done) => {
//   User.findById(id).then(user => {
//     done(null, user);
//   });
// });
//

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: keys.googleClientID,
//       client: keys.facebookClientSecret,
//       callbackURL:'auth/facebook/callback',
//       proxy:true
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       const existingUser = await User.findOne({facebookId: profile.id});
//
//       if (existingUser) {
//         return done(null, existingUser);
//       }
//
//       const user = await new User({ facebookId: profile.id}).save();
//       done(null, user);
//     }
//   )
// );
