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

/* ******** REGISTRATION/LOGIN ******** */
let members = [{
  firstName: 'John',
  lastName: 'Doe',
  email: 'johndoe@test.com',
  username: 'test',
  password: 'abc',
}]
// login function

// login get route
app.get('/login', function (req, res) {
  res.render('login');
});
// login post route

// registration get route
app.get('/register', function (req, res) {
  res.render('registration');
});

// registration post route

// home get route
app.get('/home', function (req, res) {
  res.render('home');
});

// allow you to create a snippet

// allow you to see a list of all your snippets

// allow you to see a list of all your snippets for a specific language

// allow you to see a list of all your snippets for a specific tag

// allow you to look at an individual snippet


// start server
app.listen(4000, function () {
  console.log('snip, snip');
});
