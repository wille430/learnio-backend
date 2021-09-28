const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Welcome to Express js')
})

app.listen(port, () => {
    console.log('Express js app listening on port', port)
})