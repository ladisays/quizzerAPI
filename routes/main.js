var express = require('express');
// create an instance of a router
var router = express.Router();

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});

// Collections
var quizModel = require('../models/quizModel'); // model for the quiz collection
var questionModel = require('../models/questionModel'); // model for the question collection
var categoryModel = require('../models/categoryModel'); // model for the category collection


function parser(name) {
  var parsedName = name[0].toUpperCase() + name.slice(1).toLowerCase();
  return parsedName;
}


// return all quizzes
router.route('/quizzes')
.get(function (request, response) {
  var query = {};
  quizModel.find(query, function (err, data) {
    if(err) {
      return handleError(err);
    }
    if(data) {
      response.json(data);
    }
    else {
      response.status(404).json('Oops! No data found!');
    }
  });
});

// create a new quiz
router.route('/quizzes/new')
.post(parseUrlencoded, function (request, response) {
  // if(request.body.description.length > 4) {
  //   var parsedTitle = parser(request.body.title),
  //       parsedDesc = parser(request.body.description),
  //       parsedCategory = parser(request.body.category);
        
  //   var query = {title: parsedTitle, description: parsedDesc, category: parsedCategory};
  //   quizModel.create(query, function (err, data) {
  //     if(err) {
  //       return handleError(err);
  //     }
  //     response.status(201).json(data);
  //   });
  // }
  var query = request.body;
  quizModel.create(query, function (err, data) {
    response.status(201).json(data);
  });

  // else {
  //   response.status(400).json('Invalid Request');
  // }
});

// retrieve a single quiz by its id
router.route('/quizzes/:id')
.get(function (request, response) {
  if(request.params.id) {
    var query = {_id: request.params.id};
    quizModel.findOne(query, function (err, data) {
      if(err) {
        return handleError(err);
      }
      if(data) {
        response.json(data);
      }
      // else {
      //   response.status(404).json('No data found!');
      // }
    });
  }
  else {
    response.status(404).json('No data found!');
  }
})

.put(parseUrlencoded, function (request, response) {
  if(request.params.id) {
    var query = {_id: request.params.id};
    var req = request.body,
        reqTitle = parser(req.title),
        reqDesc = parser(req.description),
        reqCat = parser(req.category);

    var updateData = {title: reqTitle, description: reqDesc, category: reqCat};
    quizModel.update(query, { $set: updateData}, function (err, data) {
      if(err) {
        return handleError(err);
      }
      if(data) {
        response.status(201).json(data + ' document was affected!');
      }

      else {
        response.status(400).json('Invalid Request!');
      }
    });
  }
})

.delete(function (request, response) {
  if(request.params.id) {
    var query = {_id: request.params.id};
    quizModel.remove(query, function (err, data) {
      if(err) {
        return handleError(err);
      }
      if(data) {
        response.json(data + ' document was affected.');
      }
      else {
        response.sendStatus(404);
      }
    });
  }
});


router.route('/quizzes/:quiz_id/questions')
.get(parseUrlencoded, function (request, response) {
  if(request.params.id) {
    var query = {quiz_id: request.params.quiz_id};
    questionModel.find(query, function (err, data) {
      if(err) {
        return response.send(err);
      }
      return response.json(data);
    });
  }
});

router.route('/quizzes/:quiz_id/questions/new')
.post(parseUrlencoded, function (request, response) {
  if(request.params.quiz_id) {

    var parsedName = request.body.name;
    var ans = request.body.answer;
    var wrong_ans = request.body.value;

    var query = {quiz_id: request.params.quiz_id, name: parsedName, answer: ans, wrong_answers: [{value: wrong_ans}] };

    // query.wrong_answers[0].push(wrong_ans);
    console.log(query, 'Ladi');
    questionModel.create(query, function (err, data) {
      if(err) {
        response.send(err);
      }
      console.log(data);
      response.status(201).json(data);
    });
  }
  else {
    response.status(400).json('Invalid Request!');
  }
});















module.exports = router;

