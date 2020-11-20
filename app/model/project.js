'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ProjectSchema = new Schema({
    title: { type: String },
    author: { type: Schema.Types.ObjectId },
    pages: [{ type: Schema.Types.ObjectId }],
    created: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
  });

  return mongoose.model('Project', ProjectSchema);
};
