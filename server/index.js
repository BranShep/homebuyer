const express = require('express');

const config = require('./config');
// const keys = require('./keys');
// const secretkeys = require('./secretkeys');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');
const jwt = require('jwt-simple');
// const AWS = require('aws-sdk');

// AWS.config.update({
//   function() {console.log("this is the secret", secretkeys.aws.ACCESS_KEY);},
//   accessKeyId: secretkeys.aws.ACCESS_KEY,
//   secretAccessKey: secretkeys.aws.ACCESS_SECRET,
//   region: 'us-west-2'
// });

const app = module.exports = express();

// app.use(bodyParser.json({limit: '50mb'})); //limits file size, default limit is 100kb
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// const s3 = new AWS.S3();



const connectString = config.connectString;


const massiveInstance = massive.connectSync({connectionString: connectString});
app.set('db', massiveInstance);
const db = app.get('db');
const users = require('./controllers/userCtrl.js');
const lists = require('./controllers/listCtrl.js');
const homes = require('./controllers/homeCtrl.js');
const priorities = require('./controllers/priorityCtrl.js');
const ratings = require('./controllers/ratingCtrl.js');
const images = require('./controllers/imageCtrl.js')



app.use(bodyParser.json());
app.use(cors());




// app.use(express.static('../../www'));
// app.use('/node_modules', express.static('./node_modules'));




// hitting Amazon's endpoint to store an image in homebuyer's bucket
// app.post('/api/newimage', function(req, res, next) {
//   console.log('here in the server');
//   const buf = new Buffer(req.body.imageBody.replace(/^data:image\/\w+;base64,/,''), 'base64')
//   console.log(req.body);

//   const bucketName = 'homebuyer-bucket/' + req.body.userEmail;
//   const params = {
//     Bucket: bucketName,
//     Key: req.body.imageName,
//     Body: buf,
//     ContentType: 'image/' + req.body.imageExtension,
//     ACL: 'public-read'
//   };

//   // console.log(req.body.imageBody);

//   s3.upload(params, function(err, data) {
//     if (err) res.status(500).send(err);
//     res.status(200).json(data);
//     console.log('upload', data);
//     console.log(err);
//   });
// });

//TEST ENDPOINTS

app.get('/test', users.authenticateRequest, (req, res, next) => {
 res.json('You got through')
})

// USER ENDPOINTS
app.get('/users/:email', users.readUserById);

//LIST ENDPOINTS
app.put('/lists/deactivate/:id', lists.deactivateList);
app.get('/lists/:user_id', lists.readListByUserId);
app.get('/lists/homes/:list_id', lists.readHomesByListId);
app.get('/lists/homes/id/:home_id',homes.readHomesByHomeId);
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



app.listen(config.port, () => {
   console.log('listening on port: ', config.port)
})
