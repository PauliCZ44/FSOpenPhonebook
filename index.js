/*
3.3: Phonebook backend step3 - done
*/

const express = require("express");  //adding express
const app = express()                // create express aplication

app.use(express.json())                 //JSON parser

const persons = [
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
          response.status(404).end()
      } else {
        response.json(pers)
      }

  })

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
