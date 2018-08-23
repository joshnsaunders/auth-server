const _ = require ('lodash')
const Path = require('path-parser')
const { URL } = require ('url')
const mongoose = require('mongoose')
const jwt = require('jwt-simple')
const config = require('../config/keys');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false});
const requireSignin = passport.authenticate('local', { session: false });

const Search = mongoose.model('search')

module.exports = app => {
  app.get('/api/search', async (req, res) => {
    let token = req.headers.authorization;
    let payload = jwt.decode(token, config.secret)

    const schools = await Search.find({_user:payload.sub});
    res.send(schools)
  })

  app.post('/api/search', async (req, res) => {
    let token = req.headers.authorization;
    let payload = jwt.decode(token, config.secret)

    // console.log('req.body 27', req.body.searchBody);

    const search = new Search ({
      body:req.body.searchBody,
      _user:payload.sub
    })

    try {
      await search.save()
      res.send(search)
    } catch(err){
      res.status(422).send(err)
    }

  })
}
