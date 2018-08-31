const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config/keys');
const nodemailer = require('nodemailer');
const tokenForUser = require('../core/core').tokenForUser
const smtpTransport = require('../services/nodemailer').smtpTransport

exports.signin = (req, res, next) => {
  res.send({
    token:tokenForUser(req.user),
  })
}

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const googleSocialID = req.body;
  let hash = Math.random().toString()
  hash = hash.slice(2, hash.length)

  if(!email || !password) {
    return res.status(422).send({ error: 'You must have an email and password'});
  }

  User.findOne({ email: email }, (err, existingUser) => {
    if (err) { return next(err); }

    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use'});
    }

    let user = new User ({
      email:email,
      password: password,
      hash: hash
    });
    user.save((err) => {
      if (err) { return next(err); }
    });

    let link = "http://" + req.get("host") + "/verify/user?id=" + user.hash;
    mailOptions = {
      from:config.emailUserName,
      to:user.email,
      subject:"Enroll Me - Verify Your Account",
      html:"Click link to verify account <a href=" + link + ">Click here to verify</a>"
    }

    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
        res.end("error");
     } else {
            console.log("Message sent: " + response.message);
         }
  });
  res.redirect(`http://www.localhost:3001/`);
  });
}

exports.emailVerification = (req, res, next) => {
  const hash = req.query.id
  if (!hash) {
    return res.status(422).send({error:'Something went wrong'})
  };
  User.findOne({hash: hash}, (err, existingUser) => {
    if (err) {return next(err)}

    if ( existingUser ){
      const user = existingUser;
      user.active = true;
      user.hash = 0;
      user.save((err) => {
        if (err) { return next(err); }
      })
      const token = tokenForUser(user)
      res.redirect(`http://www.localhost:3001/user?token=${token}`)
    }
  })
}
