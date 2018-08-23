const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config/keys');

const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub:user.id, iat: timestamp }, config.secret);
}

exports.signin = (req, res, next) => {
  res.send({
    token:tokenForUser(req.user),
  })
}

exports.googleSignUp = (req, res, next) => {
  console.log('REQ', req);
  // res.send({
  //   token:tokenForUser(req.user)
  // })
  res.send('hello from the backend')
}


// exports.googleSignIn = (req, res, next) => {
//   res.send({
//     token:tokenForUser(req.user)
//   })
// }

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
    console.log('server sign up', email, password);
  if(!email || !password) {
    return res.status(422).send({ error: 'You must have an email and password'});
  }

  User.findOne({ email: email }, (err, existingUser) => {
    if (err) { return next(err); }

    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use'});
    }

    const user = new User ({
      email:email,
      password: password
    });
    console.log('USER', user);
    user.save((err) => {
      if (err) { return next(err); }

      res.json({token: tokenForUser(user) });
    });
  });
}
