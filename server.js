var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index.html');
}); 

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});