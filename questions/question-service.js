// user-service.js
const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const GeneratorChooser = require('./questionGen/GeneratorChooser')

const app = express();
const port = 8003;

const gen = new GeneratorChooser();
const MAX_QUESTIONS = 100;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

app.set('json spaces', 40);

app.get('/randomQuestion', async (req, res) => {
    if(req.query.n > MAX_QUESTIONS){
      res.status(400).json({ error: `El límite de preguntas son ${MAX_QUESTIONS}`}); 
    }
    try {       
        var data = await gen.getCountryQuestions(req.query.n);
        res.json(data);
    } catch (error) {
        res.status(400).json({ error: error.message }); 
    }
    var fin  = performance.now();
});

const server = app.listen(port, () => {
  console.log(`Question Service listening at http://localhost:${port}`);
});

cron.schedule('0 3 * * *', async () => {
  await gen.loadGenerators();
});

module.exports = server