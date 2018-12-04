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
    title: 'Customer'
  });
});

app.post('/user/add', function(req, res){
  var newUser = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email
  }
  db.user.insert(newUser, function(req, result){
    res.redirect('/');
  });
});

app.listen(3000, function(){
  console.log('Server started on port 3000.');
});
