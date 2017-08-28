// require
const express = require('express');
const mustache = require('mustache-express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const session = require('express-session');

// configure server
const app = express();

// use body-parser and express-session
app.use(bodyparser.urlencoded({ extended: false }));
app.use(session({
    secret: '4494a;sdkfh',
    resave: false,
    saveUninitialized: true
}))

// configure mustache
app.engine('mustache', mustache());
app.set('views', './views');
app.set('view engine', 'mustache');

// start server
app.listen(4000, function () {
  console.log('snip, snip');
});
