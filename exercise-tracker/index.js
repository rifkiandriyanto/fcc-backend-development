const express = require('express')
const app = express()
const cors = require('cors')
let bodyParser = require(`body-parser`);
let users = 0;
let userMap = new Map();
let idToUserMap = new Map();
let idToExercises = new Map();
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post("/api/users", function(req, res) {
  const username = req.body.username;
  let id = userMap.get(username);
  if (!id) {
    id = (++users).toString();
    userMap.set(username, id);
    idToUserMap.set(id, username);
  }
  res.json({ username: username, _id: id });
});

app.get("/api/users", function(req, res) {
  let result = Array.from(userMap, ([username, _id]) => ({ username, _id }));
  res.send(result);
});

function objCompare(a, b) {
  if ((new Date(a.date)) < (new Date(b.date))) { return -1; }
  else if ((new Date(a.date)) < (new Date(b.date))) { return 1; }
  else { return 0; }
}

app.post("/api/users/:_id/exercises", function(req, res) {
  const id = req.params._id.toString();
  const description = req.body.description;
  const duration = parseInt(req.body.duration);
  const username = idToUserMap.get(id);
  let date = req.body.date;
  if (!date) { date = (new Date()).toDateString(); }
  else { date += "T00:00:00-06:00"; }
  date = (new Date(date)).toDateString();
  let log = idToExercises.get(id);
  if (!log) { log = []; }
  log.push({ description: description, duration: duration, date: date });
  log.sort(objCompare).reverse();
  idToExercises.set(id, log);

  res.json({ _id: id, username: username, date: date, duration: duration, description: description });
});

app.get("/api/users/:_id/logs", function(req, res) {
  const id = req.params._id.toString();
  const username = idToUserMap.get(id).toString() || "";
  const exercises = idToExercises.get(id) || [];
  const count = exercises.length;
  let from = req.query.from;
  let to = req.query.to;
  const limit = req.query.limit;
  let myLog = [];

  if (from) {
    from = (new Date(from + "T00:00:00-06:00"));
  }
  if (to) {
    to = (new Date(to + "T00:00:00-06:00"));
  }

  for (let i = 0; i < exercises.length; i++) {
    if (limit && myLog.length == limit) { break; }
    if (from && (from > (new Date(exercises[i].date)))) { continue; }
    if (to && (to < (new Date(exercises[i].date)))) { continue; }
    myLog.push(exercises[i]);
  }

  res.json({ _id: id, username: username, count: myLog.length, log: myLog });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})