// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// API endpoint for handling date requests
app.get('/api/:date?', function (req, res) {
  // Retrieve the date parameter from the request
  var dateString = req.params.date;

  // Check if the date parameter is empty
  if (!dateString) {
    // If the date parameter is empty, return the current time
    var currentDate = new Date();
    return res.json({
      unix: currentDate.getTime(),
      utc: currentDate.toUTCString()
    });
  }

  // Parse the date string and handle any invalid dates
  var date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return res.json({ error: 'Invalid Date' });
  }

  // Return the JSON object with the unix and utc keys
  return res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
