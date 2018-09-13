const Authentication = require('../controllers/authentication');
const passport = require('passport');
const passportService = require('../services/passport');
const jwt = require('jwt-simple')
const config = require('../config/keys');
const facebook = require('passport-facebook');
const nodemailer = require('nodemailer');
const smtpTransport = require('../core/core').smtpTransport
const tokenForUser = require('../core/core').tokenForUser

const requireAuth = passport.authenticate('jwt', { session: false});
const requireSignin = passport.authenticate('local', { session: false });
const requireGoogleLogIn = passport.authenticate('google', { session: false, scope: ['profile', 'email'] });

module.exports = app => {
  const heroku = 'https://localhost:3000'

  app.post('/signin', requireSignin, Authentication.signin);

  app.post('/signup', Authentication.signup );

  app.get( `/auth/google`, requireGoogleLogIn);

  app.get( `/auth/google/callback`, requireGoogleLogIn, (req, res) => {
      let link = "http://" + req.get("host") + "/verify?id=" + req.user.user.hash;

      mailOptions = {
        from:"joshnsaunders@gmail.com",
        to:user.email,
        subject:"test test test",
        html:"Click link to verify account <a href=" + link + ">Click here to verify</a>"
      }

      smtpTransport.sendMail(mailOptions, function(error, response){
       if (error) {
          res.end("error");
       } else{
              console.log("Message sent: " + response.message);
           }
         });

    res.redirect(`http://www.localhost:3001/user?token=${req.user.token}`);
    });

  app.get('/verify', (req, res) => {
    let id = req.query.id
    res.redirect(`http://www.localhost:3001/verify?id=${id}`)
  })

  app.get('/verify/user', Authentication.emailVerification)

  app.post('/resetpassword', Authentication.emailResetPassword)

  app.post('/newpassword', Authentication.newPassword)

  app.get(`${heroku}/api/logout`, (req, res) => {
    req.logout();
    res.redirect('http://www.localhost:3000/');
  });

  app.get(`${heroku}/api/current_user`, (req, res) => {
    res.send(req.user);
  });
};



// --------------------------------------------------------
//example route for protected resources
  // app.get('/message', requireAuth, (req, res) => {
  //   let token = req.headers.authorization;
  //   var payload = null;
  //   payload = jwt.decode(token, config.secret)
  //   res.send( {message: 'secret resource' });
  // });
