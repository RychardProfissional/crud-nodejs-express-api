const express = require('express')
const bodyParser = require('body-parser')
const produtos = require('./routes/produtos')
const morgan = require('morgan')

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json({ "Content-Type": 'application/json' }))

app.use('/produtos', produtos)

app.listen(3001, () => {
    console.log('servidor no ar')
})