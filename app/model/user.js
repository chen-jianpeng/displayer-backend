'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    loginname: { type: String },
    pass: { type: String },
    email: { type: String },
    avatar: { type: String },
    active: { type: Boolean, default: false },
  });

  return mongoose.model('User', UserSchema);
};
