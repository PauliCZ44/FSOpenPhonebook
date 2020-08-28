const express = require("express");  //adding express
const { response } = require("express");
const app = express()                // create express aplication
const morgan = require('morgan')    //morgan logging api
//morgan('tiny');   //Using a predefined format string 



app.use(express.json())                 //JSON parser - must be declared before all .get / .post etc.

//define my token for name and number logging
morgan.token('nameAndNumber', function (req, res) { return (
  JSON.stringify({
   name: req.body['name'],
   number: req.body['number']
  })
  )})

app.use(morgan("tiny",  {  // output :method :url :status :res[content-length] - :response-time ms  
  skip: function (req, res) { return res.statusCode === 201 }
}))


app.use(morgan(":method :url :status :res[content-length] - :response-time ms :nameAndNumber",  {
  skip: function (req, res) { return res.statusCode !== 201 }
}))


let persons = [
    { name: 'Arto Hellas', number: '040-123456', id:1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id:2 },
    { name: 'Dan Abramov', number: '12-43-234345', id:3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id:4 }
  ]
//basic get command for simple route
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`<p>Phonebook has info fo ${persons.length} people<p>  <p>${date}<p>  `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const pers = persons.find(p => p.id == id)    // try to find a person based on id in request
    if (!pers) {
        response.status(404).end(`The id of "${id}" does not exists`)
    } else {
      response.json(pers)
    }

})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  persons = persons.filter(p => p.id !== id)    // FILTER PERSONS BASED ON ID
  response.status(204).end()
})

app.post("/api/persons", (request, response) => {
  const newId = Math.floor(Math.random()*10000)
  // let nameAlreadyExist = persons.findIndex(p => p.name === request.body.name) //returns -1 if person is not found  //better code with .some

  if (persons.some(e => e.name == request.body.name)) {  //if in persons array is SOME (at least 1) name that is == to req.body.name then this is true
    return response.status(400).json({
      error: "Name must be unique"
    })
  }
  if (request.body.name === "" || request.body.number === "") {
    return response.status(400).json({
      error: "Number and name should be included"
    })
  }

  const newPerson = {
    name: request.body.name,
    number: request.body.number,
    id: newId
  }
  persons = persons.concat(newPerson)
  response.status(201).json(persons)
})

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}
app.use(unknownEndpoint)




const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
