const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const uri = process.env.MONGODB_URI

mongoose.connect(uri, {
  tls: true,
  tlsInsecure: false
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });


const personSchema = new mongoose.Schema({
    id: String,
    name: {type: String,    
        minLength: 3,    
        required: true},
    number: String,
  })

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  



module.exports = mongoose.model('Person', personSchema)