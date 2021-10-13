const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
require('./config/database').connect();
const checkEnv = require('check-env');
checkEnv(['TOKEN_KEY']);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const userRouter = require('./routes/user');
app.use('/user', userRouter);
app.get('/', (req, res) => {
    res.send('Welcome to Express js');
});
const hostname = process.env.API_HOST || 'localhost';
const port = process.env.API_PORT || 3000;
app.listen(port, hostname, () => {
    console.log('Express js app listening on port', port);
});
