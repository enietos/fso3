const http = require('http');
const express = require('express');
//const helmet = require('helmet')
const morgan = require('morgan')
const app = express();


//app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];
app.use(express.json())
//app.use(morgan('tiny'));
app.use(morgan(function (tokens, req, res) {

  const reqBody = req.body ? JSON.stringify(req.body) : "";

  return [
    tokens.method(req,res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    reqBody
  ].join(' ')
})
)



app.get("/api/persons/", (req, res) => {
  res
      .set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
      .send("<html><head></head><body></body></html>");
})

const now = new Date()


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});

app.get('/info', (request, response) => {
  response.send(`Phonebook has info for ${persons.length} people <br/>
    ${now}`
    
  );
});

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id === id);
    
    if (person) {    
        response.json(person);  
    } else {    
        response.status(404).end();  
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

const generateId = () => {
    const randId = persons.length > 0
      ? Math.max(...persons.map(p => Number(p.id))) +  1000 * Math.random()
      : 0;

    return String(randId + 2).substring(0,5);
};
  
app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name or number missing' 
        });
    }

    if (persons.find(p => p.name === body.name)) {
      return response.status(400).json({ 
          error: 'Name already in book!' 
      });
  }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    };

    persons = persons.concat(person);

    response.json(person);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
