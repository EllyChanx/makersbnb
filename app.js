var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongojs = require('mongojs');
var db = mongojs('istaytest', ['users', 'properties']);


var app = express();

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: false}));

//set static path
app.use(express.static(path.join(__dirname, '/public')));



app.get('/', function(req, res){
  res.render('index', {
    title: 'iStay'
  });
});

app.post('/user/login', function(req, res){
var logIn = {
  email: req.body.email,
  password: req.body.password
}
db.users.find(logIn, function(err, doc){
  if (doc.length === 0 || err) {
      return res.status(500).send({
          success: false,
          message: 'no user found!'
      });
    }
    res.redirect('/');
  });
});

app.get('/user/signup', function(req, res){
  res.render('signup', {
    title: 'Sign Up!'
  });
});

app.post('/user/signup', function(req, res) {
  var newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
    }
  db.users.insert(newUser, function(err) {
      if (err) {
        return res.status(500).send({
            success: false,
            message: 'User already exist!'
        });
      }
    console.log('added new user')
    res.redirect('/');
  });
});

app.get('/properties', function(req, res) {
  db.properties.find(function(err, docs){
    res.render('properties', {
      properties: docs
    });
  });
});

// app.post('/properties_bydate', function(req, res) {
//   // var av = { date: req.body.date }
//   db.properties.find({$or: [{ date1: req.body.date},{ date2: req.body.date},{ date3: req.body.date}]}, function(err, docs){
//     res.redirect('properties/bydate', {
//       properties: docs
//     });
//   });
// });

app.get('/properties/bydate', function(req, res) {
  db.properties.find({$or: [{ date1: "2018-12-06"},{ date2: "2018-12-06"},{ date3: "2018-12-06"}]}, function(err, docs){
    res.render('properties/bydate', {
      properties: docs
    });
  });
});




app.get('/properties/create', function(req, res) {
  res.render('properties/create', {
    title: 'Properties create'
  });
});

app.post('/property_created', function(req, res) {
  var newProperty = {
    pic_url: req.body.pic_url,
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    date1: req.body.date1,
    date1Status: 'Available',
    date2: req.body.date2,
    date2Status: 'Available',
    date3: req.body.date3,
    date3Status: 'Available'
  }
  db.properties.insert(newProperty, function(req, result){
    res.redirect('/properties');
  });
});

app.get('/properties/created', function(req, res) {
  res.render('properties/created', {
    title: 'Properties created'
  });
});

app.listen(3000, function(){
  console.log('Server started on port 3000.');
});
