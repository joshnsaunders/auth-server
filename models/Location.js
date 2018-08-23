const mongoose = require('mongoose');
const { Schema } = mongoose;

const locationSchema = new Schema({
  body: String,
  _user: { type: Schema.Types.ObjectId, ref: 'User' },

});

mongoose.model('location', locationSchema);
