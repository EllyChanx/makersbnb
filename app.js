var express = require('express');
var dotenv = require('dotenv').config()
var bodyParser = require('body-parser');
var path = require('path');
var mongojs = require('mongojs');
var db = mongojs(process.env.DB_URL);


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


// USERS
app.post('/user/login', function(req, res){
  var logIn = {
    email: req.body.email,
    password: req.body.password
  }
  app.set("userEmail", req.body.email)

  db.users.find(logIn, function(err, doc){
    if (doc.length === 0 || err) {
      return res.redirect('/loginerror');
    };
      res.redirect('/properties');
    });
});

app.get('/loginerror', function(req, res){
  res.render('errorlogin', {
    title: 'iStay'
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
        return res.redirect('/user/signupfail');
        // return res.status(500).send({
        //     success: false,
        //     message: 'User already exist!'
        // });
      };
    console.log('added new user')
    res.redirect('/');
  });
});

app.get('/user/signupfail', function(req, res) {
  res.render('signupfail', {
    title: 'Signup Failed'
  });
});

// PROPERTIES

// LIST ALL
app.get('/properties', function(req, res) {
  db.properties.find(function(err, docs){
    res.render('properties', {
      properties: docs
    });
  });
});

//LIST BY DATE
app.post('/properties_bydate', function(req, res) {
  app.set("myDate", req.body.my_date)
  res.redirect('properties/bydate')
});

app.get('/properties/bydate', function(req, res) {
  var myDate = app.get("myDate");

  db.properties.find( {$or: [{ date1: myDate},{ date2: myDate},{ date3: myDate}]}, null, {sort: '-price'}, function(err, docs){
    res.render('properties/bydate', {
      properties: docs
    });
  });
});

// to work on - get property object passing to this route from submitbutton
// make this work
app.post('/properties_book', function(req, res) {
  // app.set("myBooking", req.body.book_me)
  console.log(req.body.id);
  res.redirect('properties/book')
});

app.get('/properties/book', function(req, res){
  var myBooking = app.get("myBooking")
  db.properties.find(myBooking, function(err, docs){
    res.render('properties/book', {
      properties: docs
    });
  });
});

//CREATE PROPERTY
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
    date1Status: 'available',
    date2: req.body.date2,
    date2Status: 'available',
    date3: req.body.date3,
    date3Status: 'available',
    user: app.get("userEmail")
  }
  db.properties.insert(newProperty, function(req, result){
    res.redirect('/properties/created');
  });
});

app.get('/properties/created', function(req, res) {
  var user = app.get("userEmail")
  db.properties.find({ user: user }, function(err, docs){
    res.render('properties/created', {
      properties: docs
    });
  });
});

// MY PROPERTIES
app.get('/properties/myproperties', function(req, res) {
  var user = app.get("userEmail");
  db.properties.find( { user: user} ,function(err, docs){
    res.render('properties/myproperties', {
      properties: docs
    });
  });
});

app.post('/properties/myproperties_pending', function(req, res) {
  res.redirect('/properties/pending')
});

app.get('/properties/pending', function(req, res) {
  res.render('properties/pending');
});

// PENDING BY USERS
app.get('/properties/pendingproperties', function(req, res) {
  var user = app.get("userEmail");
  db.properties.find( { user: user} ,function(err, docs){
    res.render('properties/pendingproperties', {
      properties: docs
    });
  });
});


app.listen(3000, function(){
  console.log('Server started on port 3000.');
});
