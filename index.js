// imports
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

// middleware
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('post', function getPost (req) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))


// routes
app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Person.find({}).then(persons => {
    res.send(`Phonebook has info for ${persons.length} people <br /><br /> ${new Date()}`)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      }else{
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  Person.findOne({ _id:req.params.id })
    .then(foundPerson => {
      const person = foundPerson
      person.name = req.body.name
      person.number = req.body.number

      person.save()
        .then(savedPerson => res.json(savedPerson))
        .catch(error => next(error))
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const person = new Person({
    name: req.body.name,
    number: req.body.number
  })

  person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(error => next(error))
})

// error handling
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
// handler of requests with unknown endpoint
app.use(unknownEndpoint)


const errorHandler = (error, request, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'TypeError') {
    return res.status(400).json({ error: 'User has already been deleted from server.' })
  }

  next(error)
}

// handler of requests with result to errors
app.use(errorHandler)


// server start
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})