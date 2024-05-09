express = require('express')

app = express()

app.get('/', (req, res, next) => {
    res.status(200).json({
        hello: "hello world!!!"
    })
})

app.listen(3000, () => {
    console.log('servidor no ar')
})