const _ = require ('lodash')
const Path = require('path-parser')
const { URL } = require ('url')
const mongoose = require('mongoose')
const jwt = require('jwt-simple')
const config = require('../config/keys');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false});
const requireSignin = passport.authenticate('local', { session: false });

const Location = mongoose.model('location')

module.exports = app => {
  app.get('/api/location', async (req, res) => {
    let token = req.headers.authorization;
    let payload = jwt.decode(token, config.secret)

    const location = await Search.find({_user:payload.sub});
    res.send(location)
  })

  app.post('/api/location', async (req, res) => {
    let token = req.headers.authorization;
    let payload = jwt.decode(token, config.secret)

    console.log('req.body 27', req.body.locationBody);

    const location = new Location ({
      body:req.body.locationBody,
      _user:payload.sub
    })

    try {
      await location.save()
      res.send(location)
    } catch(err){
      res.status(422).send(err)
    }

  })
}
