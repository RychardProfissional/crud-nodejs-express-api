require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const produtos = require('./routes/produtos')

const app = express()
const port = process.env.SERVER_PORT || 3004

app.use(morgan('dev'))
app.use(bodyParser.json({ "Content-Type": 'application/json' }))

app.use('/produtos', produtos)

app.listen(port, () => {
    console.log(`O servidor esta rodando na porta ${port}`)
})