require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const errorHandler = require('./error-handler')

const NotefulRouter = require('./noteful/noteful-router')

const app = express()



app.use(cors({
        origin: "http://localhost:3000/"
    })
)
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';
app.use(morgan(morganOption))
app.use(helmet())

app.options('*',cors())
app.use('/api/noteful',NotefulRouter)

app.use(errorHandler)

module.exports = app