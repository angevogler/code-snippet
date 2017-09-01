const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// CREATE MEMBERS SCHEMA
const membersSchema = new mongoose.Schema ({
  firstname: { type: String },
  lastname: { type: String },
  username: { type: String, unique: true },
  password: { type: String },
});

const Members = mongoose.model('Members', membersSchema);

module.exports = Members;
