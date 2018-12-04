var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongojs = require('mongojs');
var db = mongojs('test', ['user']);


var app = express();

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: false}));

//set static path
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', function(req, res){
  res.render('index', {
    title: 'iStay'
  });
});

app.post('/signin_confirmed', function(req, res){
  // FIND DATA IN DATABASE
  res.redirect('/properties');
});

app.get('/signup', function(req, res){
  res.render('signup', {
    title: 'Sign Up!'
  });
});

app.post('/signup_confirmed', function(req, res) {
  var newUser = {
    name: req.body.first_name,
    email: req.body.email,
    password: req.body.password
  }
  db.user.insert(newUser, function(req, result){
    res.redirect('/properties');
  });
});

app.get('/properties', function(req, res) {
  var property = {
    pic_url: req.body.pic_url,
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    date1: req.body.date1,
    date1Status: req.body.date1Status,
    date2: req.body.date2,
    date2Status: req.body.dateStatus,
    date3: req.body.date3,
    date3Status: req.body.date3Status
  }
  db.property.find(property, function(req, result){
    res.redirect('/properties');
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
    date1Status: req.body.date1Status,
    date2: req.body.date2,
    date2Status: req.body.dateStatus,
    date3: req.body.date3,
    date3Status: req.body.date3Status
  }
  db.property.insert(newProperty, function(req, result){
    res.redirect('/properties/created');
  });
});

// db.properties.find().forEach(function(doc){print("Customer Name: "+doc.first_name});


app.listen(3000, function(){
  console.log('Server started on port 3000.');
});
