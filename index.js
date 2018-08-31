const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const morgan = require('morgan')
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const app = express();
const router = require('./routes/authRoutes')

// [] implement facebook strategy
// [] do a better job making sure code is DRY
// [] email verification is all I need for an MVP, two factor is a stretch
// [] figure out how to link accounts
// [] work on what to do with errors sent back to the front end.

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI);

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*'}));
router(app);

require('./services/passport');

require('./models/user');
require('./models/Search');
require('./models/Location');


require('./routes/authRoutes')(app);
require('./routes/recentSearches')(app);
require('./routes/locationRoutes')(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))
