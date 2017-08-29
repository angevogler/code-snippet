// have a comprehensive set of tests for all controllers and models
// have registration and login
// login function
function login(username, password) {
  for (let i = 0; i < members.length; i++) {
    // is username valid
    if ( username === members[i].username &&
      password === members[i].password ) {
        member = members[i];
      }

    // is password a match?
    if ( member !== null ) {
      // create the session
      req.session.who = member;

      // and redirect the user home
      res.redirect('/home');
    } else {
      // direct the user back to login with error message
      res.render('login', {
        loginError: true,
      });
    }
  }
}

// allow you to create a snippet
// allow you to see a list of all your snippets
// allow you to see a list of all your snippets for a specific language
// allow you to see a list of all your snippets for a specific tag
// allow you to look at an individual snippet
