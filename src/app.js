require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet'); //security
const cardRouter = require('./card/card-router');
const listRouter = require('./list/list-router');
const { NODE_ENV } = require('./config');

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

//Since path defaults to “/”, middleware mounted 
//without a path will be executed for every request to the app.
app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        logger.error(`Unauthorized request to path: ${req.path}`);
        return res.status(401).json({ error: 'Unauthorized request' });
    }
    next()
})

app.use(cardRouter);
app.use(listRouter);

app.get('/', (req, res) => {
    res.send('Hello, boilerplate!')
})

app.use((error, req, res, next) => {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' }}
    } else {
        response = { error }
    }
    res.status(500).json(response)
})

module.exports = app