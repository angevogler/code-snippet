// require
const express = require('express');
const mustache = require('mustache-express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const session = require('express-session');

// require schemas
const Members = require('./schemas/members');
const Snippets = require('./schemas/snippets')

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

/* ******** CONNECT DATABASE ******** */
mongoose.connect('mongodb://localhost:27017/snippets');

/* ******** REGISTRATION/LOGIN ******** */
// login get route
app.get('/', function (req, res) {
  res.render('login');
});
// login post route
app.post('/login', function (req, res) {
  Members.findOne(
    { 'username': req.body.username, 'password': req.body.password },
  function(err, member) {
    if (err) {
      res.render('login', {
        loginError: true,
      });
    } else {
      req.session.who = member;
      console.log(req.session.who)
      res.redirect('/home');
    }
  })
});

// registration get route
app.get('/register', function (req, res) {
  res.render('registration');
});

// registration post route
app.post('/register', function (req, res) {
  // let member = null;

  Members.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    password: req.body.password
  })
    .then(function (members) {
      req.session.who = members;
      console.log(req.session.who);
      console.log('registration successful');
      res.redirect('/login');
    })
    .catch(function (err) {
      console.log('registration failed');
      console.log(err)
      res.send('there was an error with your registration');
    })
});

// home get route
app.get('/home', function (req, res) {
  Snippets.find({ author: req.session.who.username })
    .then(function (snippets) {
      if ( req.session.who !== null && snippets.author !== req.session.who.username) {
      res.render('home', {
          firstTime: true,
          firstname: req.session.who.firstname,
        })
      console.log(req.session.who.firstname);
    } else if ( req.session.who !== null && snippets[0].author === req.session.who.username) {
            res.render('home', {
              hasSnippets: true,
              snippets: snippets,
            });
    }
    else {
      res.render('login', {
        loginError: true,
      });
    }
  });

});

// logout get route
app.get('/logout', function (req, res) {
  req.session.destroy
  res.redirect('/');
});

/* ******** CREATE NEW SNIPPET ******** */
// display form get route
app.get('/new', function (req, res) {
  res.render('new');
});

// post route for form
app.post('/new', function (req, res) {

  Snippets.create({
    title: req.body.title,
    author: req.session.who.username,
    language: req.body.language,
    code: req.body.code,
    tags: req.body.tags,
    notes: req.body.notes,
  })
    .then(function(snippets) {
      res.render('new', {
        newSnippet: true,
        snippet: snippets,
      });
      console.log(snippets);
      console.log(req.session.who.username);
    })
});

/* ******** DISPLAY LIST OF ALL SNIPPETS ******** */
app.get('/explore', function (req, res) {
  Snippets.find()
  .then(function(snippets, err) {
    if (req.session.who !== null) {
      res.render('display', {
        snippets: snippets,
      });
    } else if (err) {
      console.log(err);
      res.redirect('/');
    }
  })
});

/* ******** SEE LIST OF SNIPPETS FOR LANGUAGE ******** */
app.get('/language', function (req, res) {
  res.render('search', {
    languageSearch: true,
  });
});

app.post('/language', function (req, res) {
  let query = req.body.language_search;

  Snippets.find({language: new RegExp(query) })
  .then(function (snippets){
    if (req.session.who !== null) {
      res.render('display', {
        snippets: snippets,
      });
      console.log('success');
    }
  });
});

/* ******** SEE LIST OF SNIPPETS FOR TAG ******** */
app.get('/tags', function (req, res) {
  res.render('search', {
    tagsSearch: true,
  });
});

app.post('/tags', function (req, res) {
  let query = req.body.tags_search;

  Snippets.find({tags: new RegExp(query) })
  .then(function (snippets){
    if (req.session.who !== null) {
      res.render('display', {
        snippets: snippets,
      });
      console.log('success');
    }
  });
});

/* ******** LOOK AT INDIVIDUAL SNIPPET ******** */
app.get('/title/:id', function (req, res) {
  // req.params.id = req.body.title;

  Snippets.findOne({ title: req.params.id })
  .then(function(snippets) {
    res.render('display', {
      snippets: snippets,
    });
  })
});


// start server
app.listen(4000, function () {
  console.log('snip, snip');
});
