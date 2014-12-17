var fs = require('fs')
  , http = require('http')
  , https = require('https')
  , express = require('express')
  , app = express();

// require multi resource library
var multiResource = require('..');

// create parsing function for transforming the results, i.e. removing extra messages
// that are not needed to be repeated in every part of response
// f.e. in this example we want to transform the final result by removing extra status and return only data object.
var _parse = function( inputString ) {
  var json;
  try {
    json = JSON.parse( inputString );
  } catch(e) {
    return { error: 'error parsing json: ' + e.toString() };
  }
  return json.data;
};
// assign middleware to url, other option is to give url as a parameter
// like this :
// app.use(multiResource({ url: '/resource' }) );
app.use( '/resource', multiResource({ parse: _parse }) );

// some sample API calls
app.get('/users/:id', function(req, res) {
  res.json({
    status: 'ok',
    data: [
      {name: 'Franck', age: 30},
      {name: 'John', age: 25}
    ]
  });
});

app.get('/projects/:id', function(req, res) {
  res.json({
    status: 'ok',
    data: [
      {name: 'Project 1', dueDate: 'Friday'},
      {name: 'Project 2', dueDate: 'Tuesday'}
    ]
  });
});

app.all('*', function(req, res) {
  res.send('Hallo hallo');
});

// https options
var key = fs.readFileSync('./test_data/key.pem');
var cert = fs.readFileSync('./test_data/cert.pem')
var https_options = {
    key: key,
    cert: cert
};
// test both http and https
http.createServer(app).listen(8080);
https.createServer(https_options, app).listen(8088);
console.log('Listening http at 8080, https at 8088');