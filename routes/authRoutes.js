const Authentication = require('../controllers/authentication');
const passport = require('passport');
const passportService = require('../services/passport');
const jwt = require('jwt-simple')
const config = require('../config/keys');
const facebook = require('passport-facebook');
//const jwt = require('jwt-simple');
//const User = require('../models/user');
//const config = require('../config/keys');

const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub:user.id, iat: timestamp }, config.secret);
}
// working on adding in google auth strategy to return user where email:Email
// then need to add something to create the user if no email and then also to
// add some type of catch if a user decides to go back and log in locally, but created their
// account first with google or facebook.

const requireAuth = passport.authenticate('jwt', { session: false});
const requireSignin = passport.authenticate('local', { session: false });
const requireGoogleLogIn = passport.authenticate('google', { session: false, scope: ['profile', 'email'] });

module.exports = app => {
  const heroku = 'https://localhost:3000'

  //app.post('/googlesignin', requireGoogleLogIn, Authentication.googleSignIn);

  app.post('/signin', requireSignin, Authentication.signin);

  app.post('/signup', Authentication.signup );

  app.get( `/auth/google`, requireGoogleLogIn);

app.get('/test', (req, res) => {
  console.log('inside test');
  res.send('inside test')
})
//example route for protected resources
  app.get('/message', requireAuth, (req, res) => {
    let token = req.headers.authorization;
    var payload = null;
    payload = jwt.decode(token, config.secret)
    console.log('payload', payload);
    res.send( {message: 'secret resource' });
  });



  app.get(
    `/auth/google/callback`,
    requireGoogleLogIn,
    (req, res) => {
      console.log('REQUEST', req.user);
      res.redirect('http://www.localhost:3001/signup');
    }
  );

  app.get(`${heroku}/api/logout`, (req, res) => {
    req.logout();
    res.redirect('http://www.localhost:3000/');
  });

  app.get(`${heroku}/api/current_user`, (req, res) => {
    console.log('hello');
    res.send(req.user);
  });
};
