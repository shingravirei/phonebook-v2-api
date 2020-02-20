require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.DB_URL;

mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => {
        console.log('connected to MongoDB');
    })
    .catch(err => {
        console.log(err);
    });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: String
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Person', personSchema);
