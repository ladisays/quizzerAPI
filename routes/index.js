var express = require('express');
// create an instance of a router
var router = express.Router();

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});

// Collections
// var quizModel = require('../models/quizModel'); // model for the quiz collection
var questionModel = require('../models/questionModel'); // model for the question collection
var categoryModel = require('../models/categoryModel'); // model for the category collection


function parser(name) {
  var parsedName = name[0].toUpperCase() + name.slice(1).toLowerCase();
  return parsedName;
}

router.route('/tags')
.get(function (request, response) {
  var query = {};
  questionModel.find(query, 'tag -_id', function (err, data) {
    if(err) {
      return response.send(err);
    }
    if(data) {
      return response.json(data);
    }
    return response.status(404).json('No data found!');
  });
});

router.route('/tags/:tag')
.get(parseUrlencoded, function (request, response) {
  if(request.params.tag) {

    var query = {tag: parser(request.params.tag)};
    questionModel.find(query, function (err, data) {
      if(err) {
        return response.send(err);
      }
      if(data) {
        return response.json(data);
      }
      return response.status(404).json('No data found!');
    });
  }
})

.delete(parseUrlencoded, function (request, response) {
  if(request.params.tag) {
    var query = {tag: parser(request.params.tag)};
    questionModel.remove(query, function (err, data) {
      if(err) {
        return response.send(err);
      }
      return response.json(data + 'document was affected.');
    });
  }
});


router.route('/questions')
.get(function (request, response) {
  var query = {};
  questionModel.find(query, function (err, data) {
    if(err) {
      return response.send(err);
    }
    if(data) {
      return response.json(data);
    }
  });
})

.post(parseUrlencoded, function (request, response) {
  if(request.body.name) {
    var query = {
      tag: parser(request.body.tag),
      name: parser(request.body.name),
      answer: request.body.answer,
      wrong_answers: [{value: request.body.value}]
    };

    questionModel.create(query, function (err, data) {
      if(err) {
        return response.send(err);
      }
      return response.status(201).json(data);
    });
  }
  else {
    return response.status(400).json('Invalid request');
  }
});


router.route('/questions/:id')
.get(function (request, response) {
  if(request.params.id) {
    var query = {_id: request.params.id};
    questionModel.findById(query, function (err, data) {
      if(err) {
        return response.send(err);
      }
      if(data) {
        return response.json(data);
      }
      else {
        return response.status(404).json('No data found!');
      }
    });
  }
})

.put(parseUrlencoded, function (request, response) {
  if(request.params.id) {
    var query = {_id: request.params.id};
    var updateData = {
      tag: parser(request.body.tag),
      name: request.body.name,
      answer: request.body.answer,
      wrong_answers: [{value: request.body.value}]
    };

    questionModel.findByIdAndUpdate(query, {$set: updateData}, function (err, data) {
      if(err) {
        return response.send(err);
      }
      if(data) {
        return response.status(201).json(data + ' document was affected.');
      }
      else {
        return response.status(400).json('Invalid request!');
      }
    });
  }
})

.delete(function (request, response) {
  if(request.params.id) {
    var query = {_id: request.params.id};
    questionModel.findByIdAndRemove(query, function (err, data) {
      if(err) {
        return response.send(err);
      }
      if(data) {
        return response.json(data + ' document was removed.');
      }
      else {
        return response.sendStatus(404);
      }
    });
  }
});



module.exports = router;








