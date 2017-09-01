const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

// CREATE SNIPPETS SCHEMA
const snippetSchema = new mongoose.Schema ({
  title: { type: String },
  author: { type: String },
  language: { type: String },
  code: { type: String },
  tags: { type: String },
  notes: { type: String }
});

const Snippets = mongoose.model('Snippets', snippetSchema);

module.exports = Snippets;
