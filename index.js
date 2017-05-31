'use strict';

var express = require('express');

var config = require('./config');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
var jwt = require('jwt-simple');
var app = module.exports = express();
var connectString = config.connectString;
var massiveInstance = massive.connectSync({ connectionString: connectString });
app.set('db', massiveInstance);
var db = app.get('db');
var users = require('./controllers/userCtrl.js');
var lists = require('./controllers/listCtrl.js');
var homes = require('./controllers/homeCtrl.js');
var priorities = require('./controllers/priorityCtrl.js');
var ratings = require('./controllers/ratingCtrl.js');
var images = require('./controllers/imageCtrl.js');

app.use(bodyParser.json());
app.use(cors());


//TEST ENDPOINTS

app.get('/test', users.authenticateRequest, function (req, res, next) {
  res.json('You got through');
});

// USER ENDPOINTS
app.get('/users/:email', users.readUserById);

//LIST ENDPOINTS
app.put('/lists/deactivate/:id', lists.deactivateList);
app.get('/lists/:user_id', lists.readListByUserId);
app.get('/lists/homes/:list_id', lists.readHomesByListId);
app.get('/lists/homes/id/:home_id', homes.readHomesByHomeId);
app.post('/lists', lists.createList);

//HOME ENDPOINTS
app.post('/lists/homes', homes.createHome);
app.post('/lists/homes/deactivate/:home_id', homes.deactivateHome);
app.put('/lists/homes/edit', homes.editHome);

//PRIORITIES ENDPOINTS
app.post('/priorities', priorities.createPriorities);
app.get('/priorities', priorities.readPriorities);
app.put('/priorities', priorities.editPriorities);
app.delete('/priorities/:id', priorities.deletePriority);
// edit priorities


//RATINGS ENDPOINTS
app.get('/ratings', ratings.readRatings);
app.post('/ratings', ratings.createRatings);
app.put('/ratings', ratings.editRatings);

//IMAGES ENDPOINTS
app.post('/images', images.addImage);

//AUTH ENDPOINTS
app.post('/auth/google', users.googleLogin);
app.post('/auth/local/register', users.localRegister);
app.post('/auth/local/login', users.localLogin);

app.listen(config.port, function () {
  console.log('listening on port: ', config.port);
});