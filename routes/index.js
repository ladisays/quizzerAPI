// Collections
var questionModel = require('../models/question'); // model for the question collection
var userModel = require('../models/user'); // model for the user collection


function parser(name) {
  var parsedName = name[0].toUpperCase() + name.slice(1).toLowerCase();
  return parsedName;
}

// configure cors
// var cors = require('cors');

// var corsOptions = {
//   origin: 'http://localhost:4000'
// };

module.exports = function(router, passport) {

  router.route('/')
  .get(function (request, response) {
    response.json('Welcome to the Quizzer API!');
  });


  router.route('/login')
  .get(function (request, response) {
    response.send('Please proceed to the POST at /login');
  })

  .post(passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
  }));


  router.route('/loggedin')
  .get(function (request, response) {
    response.send(request.isAuthenticated() ? request.user : '0');
  });


  router.route('/signup')
  .get(function (request, response) {
    response.send('This is the signup page...Please proceed to POST!');
  })

  .post(passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
  }));


  // =====================================
  // LOGOUT ==============================
  // =====================================
  router.route('/logout')
  .post(function (request, response) {
      request.logout();
      response.redirect('/');
  });


  // =====================================
  // PROFILE =============================
  // =====================================

  router.route('/profile') 
  .get(isLoggedIn, function (request, response) { // show the current user's details
    return response.json(request.user.local);
  });


  router.route('/profile/questions')
  .get(isLoggedIn, function (request, response) { // show all the questions created by the current user
    var query = {user_id: request.user.id};
    questionModel.find(query, function (err, questions) {
      if(err) {
        return response.send(err);
      }
      if(!questions) {
        response.send('No questions for this user!');
      }
      response.json(questions);
    });
  })

  .post(isLoggedIn, function (request, response) { // allow the current user to create a question
    if(request.body.name && request.body.tag && request.body.answer && request.body.value) {
      var query = {
        user_id: request.user.id,
        tag: parser(request.body.tag),
        name: parser(request.body.name),
        wrong_answers: [{value: request.body.value}]
      };

      questionModel.create(query, function (err, data) {
        if(err) {
          return response.send(err);
        }
        if(!data) {
          return response.status(400).json('Invalid request.');
        }
        response.status(201).json(data);
      });
    }
  });


  router.route('/profile/questions/:id')
  .get(isLoggedIn, function (request, response) { // find a question with its id for the current user
    if(request.params.id) {
      var query = {
        user_id: request.user.id,
        _id: request.params.id
      };

      questionModel.findOne(query, function (err, question) {
        if(err) {
          return response.send(err);
        }
        if(!question) {
          return response.status(404).json('Oops! No question found here.');
        }
        response.json(question);
      });
    }
  })

  .put(isLoggedIn, function (request, response) { // update a question with its id
    if(request.params.id) {
      var query = {
        _id: request.params.id,
        user_id: request.user.id
      };

      var updateData = {
        tag: parser(request.body.tag),
        name: request.body.name,
        answer: request.body.answer,
        wrong_answers: [{value: request.body.value}]
      };

      questionModel.findOneAndUpdate(query, {$set: updateData}, function (err, data) {
        if(err) {
          return response.send(err);
        }
        return response.json(data + ' document was successfully updated!');
      });
    }
  })

  .delete(isLoggedIn, function (request, response) {
    if(request.params.id) {
      var query = {_id: request.params.id, user_id: request.params.user_id};

      questionModel.findOneAndRemove(query, function (err, data) {
        if(err) {
          return response.send(err);
        }
        return response.json(data + ' document was successfully removed!');
      });
    }
  });


  // =====================================================
  // TAGS ================================================
  // =====================================================

  // list all tags
  router.route('/tags')
  .get(isLoggedIn, function (request, response) {
    var query = {};
    questionModel.distinct('tag', 'tag -_id', function (err, tags) {
      if(err) {
        return response.send(err);
      }
      if(tags) {
        return response.json(tags);
      }
      return response.status(404).json('No data found!');
    });
  });


  // list a single tag and its questions
  router.route('/tags/:tag')
  .get(isLoggedIn, function (request, response) {
    if(request.params.tag) {

      var query = {tag: parser(request.params.tag)};
      questionModel.find(query, function (err, tag) {
        if(err) {
          return response.send(err);
        }
        if(tag) {
          return response.json(tag);
        }
        return response.status(404).json('No data found!');
      });
    }
  });



  // ================================================
  // QUESTIONS ======================================
  // ================================================

  // list all questions that have been created
  router.route('/questions')
  .get(isLoggedIn, function (request, response) {
    var query = {};
    questionModel.find(query, function (err, questions) {
      if(err) {
        return response.send(err);
      }
      if(questions) {
        return response.json(questions);
      }
    });
  });


  //list a single question by its id
  router.route('/questions/:id')
  .get(isLoggedIn, function (request, response) {
    if(request.params.id) {
      var query = {_id: request.params.id};
      questionModel.findById(query, function (err, question) {
        if(err) {
          return response.send(err);
        }
        if(question) {
          return response.json(question);
        }
        else {
          return response.status(404).json('No data found!');
        }
      });
    }
  });



  // ======================================================
  // USERS ================================================
  // ======================================================


  // list all users
  router.route('/users')
  .get(isLoggedIn, function (request, response) {
    userModel.find(function (err, users) {
      if(err) {
        return response.send(err);
      }
      return response.json(users);
    });
  });


  // list a single user
  router.route('/users/:id')
  .get(isLoggedIn, function (request, response) {
    if(request.params.id) {
      var query = {_id: request.params.id};
      userModel.findById(query, function (err, user) {
        if(err) {
          return response.send(err);
        }
        return response.json(user);
      });
    }
  });


  // list all the questions from a single user
  router.route('/users/:id/questions')
  .get(isLoggedIn, function (request, response) {
    if(request.params.id) {
      var query = {user_id: request.params.id};
      questionModel.find(query, function (err, questions) {
        if(err) {
          return response.send(err);
        }
        return response.json(questions);
      });
    }
  });



  // route middleware to make sure a user is logged in
  function isLoggedIn(request, response, next) {
    // if user is authenticated in the session, carry on 
    if (request.isAuthenticated()) {
      return next();
    }
    else {

    // if they aren't redirect them to the home page
    // response.redirect('/');
      response.send(401);
    }
  }
};

