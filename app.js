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

// temporary storage for schemas
let members = [{
  firstName: 'John',
  lastName: 'Doe',
  username: 'test',
  password: 'abc',
}]

let snippets = [{
  title: 'New Snippet',
  code: `app.listen(4000, function () {
        console.log('snip, snip');
        });`,
  notes: 'here is a snippet',
  language: 'JavaScript',
  tags: 'no',
  author: 'test',
}]

/* ******** REGISTRATION/LOGIN ******** */
// login get route
app.get('/login', function (req, res) {
  res.render('login');
});
// login post route
app.post('/login', function (req, res) {
  // define constant variables for username and password
  const username = req.body.username;
  const password = req.body.password;

  // id for members
  let member = null;

  // is username valid?
  // if so is password a match?
  for (let i = 0; i < members.length; i++) {
    if (username === members[i].username &&
        password === members[i].password) {
          member = members[i];
        }
    }

    // if it is a match redirect them to the home screen otherwise return error message
    if ( member !== null) {
      // create session
      req.session.who = member;

      res.redirect('/home');
    } else {
      console.log('login failed');
      console.log(username);
      console.log(password);
      res.render('login', {
        loginError: true,
      });
    }
});

// registration get route
app.get('/register', function (req, res) {
  res.render('registration');
});

// registration post route
app.post('/register', function (req, res) {
  const profile = req.body;

  // set up session for new member
  req.session.who = {
    firstName: profile.firstname,
    lastName: profile.lastname,
    username: profile.username,
    password: profile.password,
  }

  // push to members array
  members.push(req.session.who);

  console.log(members)
  res.redirect('/home');
});

// home get route
app.get('/home', function (req, res) {
  for (let i = 0; i < snippets.length; i++ ) {
    if ( snippets[i].author === req.session.who.username ) {
        res.render('home', {
          hasSnippets: true,
          snippets: snippets,
        });
    } else {
      res.render('home', {
        firstTime: true,
        member: req.session.who,
      });
    }
  }
});

/* ******** CREATE NEW SNIPPET ******** */
// display form get route
app.get('/new', function (req, res) {
  res.render('new', {
    snippets: snippets,
  });
});

// post route for form
app.post('/new', function (req, res) {

  // set up snippet
  let snippet = ({
    title: req.body.title,
    code: req.body.code,
    notes: req.body.notes,
    language: req.body.language,
    tags: req.body.tags,
    author: req.session.who.username,
  });

  snippets.push(snippet);
  console.log(snippets);

  res.render('new', {
    newSnippet: true,
    snippet: snippet,
  })
});

/* ******** DISPLAY LIST OF ALL SNIPPETS ******** */
app.get('/explore', function (req, res) {
  res.render('display', {
    snippets: snippets,
  });
});

/* ******** SEE LIST OF SNIPPETS FOR LANGUAGE ******** */
app.get('/language', function (req, res) {
  res.render('search', {
    languageSearch: true,
  });
});

app.post('/language', function (req, res) {
  let query = req.body.language_search;

  for (let i = 0; i < snippets.length; i++ ) {
    if ( query.toLowerCase() === snippets[i].language.toLowerCase() ) {
      console.log(query);
      console.log('success!');
      res.render('display', {
        snippets: snippets,
      });
    } else {
      console.log(query);
      res.send('error');
    }
  }
});

/* ******** SEE LIST OF SNIPPETS FOR TAG ******** */
app.get('/tags', function (req, res) {
  res.render('search', {
    tagsSearch: true,
  });
});

app.post('/tags', function (req, res) {
  let query = req.body.tags_search;

  for (let i = 0; i < snippets.length; i++ ) {
    if ( query.toLowerCase() === snippets[i].tags.toLowerCase() ) {
      console.log(query);
      console.log('success!');
      res.render('display', {
        snippets: snippets,
      });
    } else {
      console.log(query);
      res.send('error');
    }
  }
});

/* ******** LOOK AT INDIVIDUAL SNIPPET ******** */
// app.get('/title/:id', function (req, res) {
//   req.params.id = snippets.title;
//
//   res.render('display', {
//
//   })
// });


// start server
app.listen(4000, function () {
  console.log('snip, snip');
});
