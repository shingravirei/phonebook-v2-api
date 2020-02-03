const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const moment = require('moment');
const uuid = require('uuid');

let persons = require('./persons');

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body);
});

app.use(express.static('build'));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan(':method :url :status :response-time ms :body'));

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        });
    }

    const duplicatedPerson = persons.filter(
        person => person.name.toLowerCase() === body.name.toLowerCase()
    );

    if (duplicatedPerson.length > 0) {
        return res.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = { ...body, id: uuid(), time: moment().valueOf() };

    persons = persons.concat(person);

    res.json(person);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);

    persons = persons.filter(person => person.id !== id);

    res.status(204).end();
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
