const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password> <opt.:name> <opt.:number>')
  process.exit(1)
}

if (process.argv.length == 4) {
    console.log('Please provide the number when creating a new Person: node mongo.js <password> <opt.:name> <opt.:number>')
    process.exit(1)
}
  
const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0bypauli.btdif.mongodb.net/PhonebookDB?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personsSchema = new mongoose.Schema({
    name: String,
    number: String   
})

const Person = mongoose.model("Person", personsSchema)  //schema model for persons

// Fetching persons 

const listAllNumbers = () => {
    Person.find({}).then(res => {
        console.log("Phonebook:")
        res.forEach(pers => {
            console.log(pers.name, pers.number)
          })
        mongoose.connection.close()
    })
}

const createPersonAndSave = (newName, newNumber) => {
    const person = new Person({
        name: newName,
        number: newNumber
    })
    
    person.save().then(result => {
        console.log('person saved!')
        //console.log("result:\n", result )
        mongoose.connection.close()  //this closes the connection to database. Connection must be closed or this program will never end!
      })
}

if (process.argv.length > 3) {
    newName = process.argv[3]
    newNumber = process.argv[4]
    createPersonAndSave(newName, newNumber)
} else {
    listAllNumbers()
}