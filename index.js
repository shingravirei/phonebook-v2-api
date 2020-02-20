const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const moment = require('moment');
const Person = require('./models/person');

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body);
});

app.use(express.static('build'));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan(':method :url :status :response-time ms :body'));

app.get('/api/persons', async (req, res) => {
    Person.find({})
        .then(persons => {
            res.json(persons.map(person => person.toJSON()));
        })
        .catch(err => {
            console.log(err);
            res.statusCode(400).end();
        });
});

app.post('/api/persons', async (req, res) => {
    const { name, number } = req.body;

    if (!name || !number) {
        return res.status(400).json({
            error: 'content missing'
        });
    }

    Person.find({}).then(persons => {
        const person = persons.filter(
            person => person.name.toLowerCase() === name.toLowerCase()
        );

        if (person.length > 0) {
            res.status(404).json({ error: 'Person already in the db' });
        } else {
            const person = new Person({
                name,
                number,
                date: moment().valueOf()
            });

            person
                .save()
                .then(savedPerson => {
                    console.log('person saved');
                    res.json(savedPerson.toJSON());
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).end();
                });
        }
    });

    // creating a new person and saving it to the db
});

app.get('/api/persons/:id', async (req, res) => {
    const { id } = req.params;

    Person.findById({ _id: id })
        .then(person => {
            if (person) {
                res.json(person);
            } else {
                res.status(404).end();
            }
        })
        .catch(err => {
            console.log(err);
            res.status(400).send({ error: 'wrong id type.' });
        });
});

app.delete('/api/persons/:id', async (req, res) => {
    const { id } = req.params;

    Person.findByIdAndDelete({ _id: id })
        .then(() => {
            console.log('Person removed from list');
            res.status(204).end();
        })
        .catch(err => {
            console.log(err);
            res.status(400).end();
        });
});

app.put('/api/persons/:id', async (req, res) => {
    const { id } = req.params;
    const { name, number } = req.body;

    const person = {
        name,
        number
    };

    Person.findByIdAndUpdate(id, person, { new: true })
        .then(updatedPerson => {
            console.log('Person updated');
            res.json(updatedPerson.toJSON());
        })
        .catch(err => {
            console.log(err);
            res.status(400).end();
        });
});

app.get('/info', (req, res) => {
    const time = moment().format('dddd, MMMM Do YYYY, h:mm:ss a');
    const personsLength = persons.length;

    res.send(
        `<h1>Info</h1><p>The Phonebook has info for ${personsLength} people</p><p>${time}</p>`
    );
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
