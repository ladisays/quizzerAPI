// =============================================================================
// SET ENVIRONMENT VARIABLES ===================================================
// =============================================================================
var express  = require('express');
var app      = express();
// var cors     = require('cors');
var router   = express.Router();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');

var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var configDB     = require('./config/database');

// CORS configuration ==========================================================
// var allowCrossDomain = function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//   res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, Content-Length, X-Requested-With');
//   next();
// };

// app.use(allowCrossDomain);

// app.use(cors());

// APP CONFIGURATION ===========================================================
mongoose.connect(configDB.url); // connect to our database

// app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded()); // read information from html forms

require('./config/passport')(passport);

// required for passport
app.use(session({ secret: 'thequizzer' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// routes ======================================================================
require('./routes/index.js')(router, passport); // load our routes and pass in our app and fully configured passport
app.use('/', router);
// launch ======================================================================
app.listen(port, function() {
  console.log("The Quizzer API is running at localhost:" + port);
});








