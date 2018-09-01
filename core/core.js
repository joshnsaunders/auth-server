const jwt = require('jwt-simple');
const config = require('../config/keys');
const nodemailer = require('nodemailer');


exports.tokenForUser = (user) => {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub:user.id, iat: timestamp }, config.secret);
    }

exports.smtpTransport = nodemailer.createTransport({
    service:"Gmail",
    auth : {
      user:config.emailUserName,
      pass:config.emailPassword,
        }
      })
