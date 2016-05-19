var express = require('express');

var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/company_db');

require('./config/express').addMiddleware(app)
require('./routes')(app)

app.listen(4000, function() {
  console.log('Express server listening. 127.0.0.1:4000');
});