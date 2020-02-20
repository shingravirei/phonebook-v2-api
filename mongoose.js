require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.DB_URL;

mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => {
        console.log(err);
    });

mongoose.set('useFindAndModify', false);

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        minlength: 8,
        required: true
    },
    date: String
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Person = mongoose.model('Person', personSchema);

// const person = new Person({
//     name: 'Moment',
//     number: '57-5555-5555',
//     date: moment().valueOf()
// });

// person
//     .save()
//     .then(res => {
//         console.log('person saved');
//         mongoose.connection.close();
//     })
//     .catch(err => {
//         console.log(err);
//     });

Person.find({})
    .then(res => {
        res.forEach(person => {
            console.log(person.toJSON());
        });
        mongoose.connection.close();
    })
    .catch(err => console.log(err));
