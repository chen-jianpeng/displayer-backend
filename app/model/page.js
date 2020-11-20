'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const PageSchema = new Schema({
    name: { type: String },
    url: { type: String },
    author: { type: Schema.Types.ObjectId },
    created: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
  });

  return mongoose.model('Page', PageSchema);
};
