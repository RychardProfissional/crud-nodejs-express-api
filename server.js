const express = require('express')
const bodyParser = require('body-parser')
const produtos = require('./routes/produtos')

const app = express()

app.use(bodyParser.json({ type: 'application/json' }))

app.use('/produtos', produtos)

app.listen(3001, () => {
    console.log('servidor no ar')
})