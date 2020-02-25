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
    try {
        const persons = await Person.find({});

        res.json(persons.map(person => person.toJSON()));
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

app.post('/api/persons', async (req, res) => {
    const { name, number } = req.body;

    if (!name || !number) {
        throw new Error('name and/or number missing');
    }

    try {
        const person = new Person({
            name,
            number,
            date: moment().valueOf()
        });

        const result = await person.save();

        res.json(result);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

app.get('/api/persons/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const person = await Person.findById({ _id: id });

        res.json(person);
    } catch (err) {
        res.status(400).send({ error: 'Person not found' });
    }
});

app.delete('/api/persons/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Person.findByIdAndDelete({ _id: id });

        res.status(204).end();
    } catch (err) {
        res.status(400).send({
            error: 'Person not found, thus it was not deleted from db'
        });
    }
});

app.put('/api/persons/:id', async (req, res) => {
    const { id } = req.params;
    const { name, number } = req.body;

    const person = {
        name,
        number
    };

    try {
        const updatedPerson = await Person.findByIdAndUpdate(id, person, {
            new: true
        });

        res.json({ updatedPerson });
    } catch (err) {
        res.status(400).end();
    }
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
