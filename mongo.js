const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://phonebook:${password}@cluster0.w58hz.mongodb.net/phonebook?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
    })

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5){
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
} else if (process.argv.length === 3){
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person.name,' ',person.number)
        })
        mongoose.connection.close()
      })
} else {
    console.log('please use "node mongo.js <password>" to retrieve list'+
    'or "node mongo.js <password> <name> <number>" to add person to phone book')
    mongoose.connection.close()
}