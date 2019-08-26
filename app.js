var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var app = express();
var cors = require('cors')

var bundan = require('./controllers/scgController.js')
var line = require('./controllers/lineController.js')
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

 
app.all('/getDB', stamper, line.getDB)
app.all('/setDB', stamper, line.setDB)
app.post('/sendLine', stamper, line.sendLine)
app.get('/findRestaurant',stamper, bundan.findRestaurant)
app.get('/findXYZ',stamper, bundan.findXYZ)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.send('PAGE NOT FOUND')
  console.log('PAGE NOT FOUND')
});
 

function stamper(request, response, next) { 
	var requestIp = request.headers['X-Real-IP'] || request.connection.remoteAddress 
	requestIp = requestIp.substring(7, requestIp.length) 
	if (requestIp == "") requestIp = "localhost" 
	console.log(requestIp, '|', request.method, request.url) 
	next() 
}
module.exports = app;
