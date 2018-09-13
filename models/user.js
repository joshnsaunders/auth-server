const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, default: null },
  hasLoggedInLocally: { type: Boolean, default: false },
  hasLoggedInWithGoogle:{ type: Boolean, default: false },
  hasLoggedInWithFacebook: {type: Boolean, default: false },
  googleAccountLinkedWithLocal: {type: Boolean, default: false },
  facebookAccountLinkedWithLocal: { type: Boolean, default: false },
  googleAccountEmailVerified: { type: Boolean, default: false},
  facebookAccountEmailVerified: { type: Boolean, default: false},
  active: { type: Boolean, default: false},
  hash: { type: Number, default: 0},
  emailResetHash: { type: Number, default: 0},
});

userSchema.pre('save', function(next) {

  const user = this;
  if (!user.isModified('password')) {return next();}

  bcrypt.genSalt(10, function (err, salt) {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) { return next(err); }

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

const ModelClass = mongoose.model('user', userSchema);

module.exports = ModelClass;
