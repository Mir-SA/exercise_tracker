const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const users = []
const exercises = []
let id = 0

const getExercises = (id) => exercises.filter(exercise => exercise._id === id)

app.post("/api/users", (req, res) => {
  const {username} = req.body

  if(username) {
    id++
    const user = {
      _id: `${id}`,
      username
    }

    users.push(user)

    return res.json(user)
  }
})

app.get('/api/users', (req, res) => {
  return res.json(users)
})

app.post("/api/users/:_id/exercises", (req, res) => {
  let {description, duration, date} = req.body
  const { _id } = req.params
  duration = parseInt(duration)
  date = date === "" || date === undefined ? new Date() : new Date(date)

  let exercise = {
    date: date.toDateString(),
    duration,
    description: description.toString()
  }
  let newUser

  users.map((user) => {
    if(user._id === _id.toString()) {
        newUser = {
          ...user,
          ...exercise
        }

        exercises.push(newUser)

        return res.json(newUser)
    } 
  })
  return res.json({error: "No Such User"})
})

app.get("/api/users/:_id/logs", (req, res) => {
  const {_id} = req.params
  const { from, to, limit} = req.query

  let log = getExercises(_id)

  if(limit) log = log.slice(0, +limit)

  if(from) {
    const fromDate = new Date(from)
    log = log.filter(exe => new Date(exe.date) >= fromDate)
  }

  if(to) {
    const toDate = new Date(to)
    log = log.filter(exe => new Date(exe.date) <= toDate)
  }
  console.log(log)
  res.json({
    _id,
    username: log[0].username,
    count: log.length,
    log
  })
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
