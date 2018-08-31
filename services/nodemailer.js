const nodemailer = require('nodemailer');
const config = require('../config/keys')

exports.smtpTransport = nodemailer.createTransport({
      service:"Gmail",
      auth : {
        user:config.emailUserName,
        pass:config.emailPassword,
      }
    })
