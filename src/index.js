const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
require('./config/database').connect()

const checkEnv = require('check-env')
checkEnv(['TOKEN_KEY'])

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


const userRouter = require('./routes/user')

app.use('/user', userRouter)

app.get('/', (req, res) => {
    res.send('Learn.io API')
})

const hostname = process.env.API_HOST || '0.0.0.0'
const port = process.env.API_PORT || 3000

app.listen(port, hostname, () => {
    console.log(`Listening on ${hostname}:${port}`)
})