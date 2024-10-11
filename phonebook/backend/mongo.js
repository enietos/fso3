const mongoose = require('mongoose')


if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}



const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];
const generateId = () => {
    return Math.floor(Math.random() * 1000000).toString();
  };


const url =
  `mongodb+srv://eliasfs:eliasfs@eliasn.65ri8.mongodb.net/phonebook?retryWrites=true&w=majority&appName=eliasn`

mongoose.set('strictQuery',false)

mongoose.connect(url)


const personSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


const person = new Person({
    id: 'testID',
    name: 'Elias',
    number: '1234',
})

/*
person.save().then(result => {
  console.log('Person saved!')
  mongoose.connection.close()
})
*/

const newPerson = new Person({
    id: generateId(),
    name: name,
    number: number,
  });

  if (process.argv.length > 3) {
    console.log('Adding person to the database...');
  
    newPerson.save().then(() => {
      console.log(`Person added: ${name} with number ${number}`);
  
      // List all persons after the new person is saved
      Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person);
        });
  
        mongoose.connection.close();
      });
    }).catch(error => {
      console.error('Error saving person:', error);
      mongoose.connection.close();
    });
  }

if (process.argv.length<4)
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person);
    });
    mongoose.connection.close();
  })