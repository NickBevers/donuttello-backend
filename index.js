// Define imports 
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

// Setup the dotenv package
require('dotenv').config();

// Define the routes to the correct files
const donutRouter = require('./routes/api/v1/donuts');
const donutController = require('./controllers/donutController');
const usersRouter = require('./routes/api/v1/users');
const indexRouter = require('./routes/index');


// Setup extra settings for express
app.use(cors({origin: true}));

app.use((req, res, next) => {
    const corsWhitelist = [
        'https://donuttello-frontend-r0702962-thomasmoreb.vercel.app',
        'https://donuttello-frontend.vercel.app/',
    ];
    if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    }

    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configure routes
app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/donuts', donutRouter);
app.get('/donuts/:id', donutController.getOne);

// Connect to the database
mongoose.connect(process.env.DB_CONN, {useNewUrlParser: true, useUnifiedTopology: true, dbName: process.env.DB_NAME});

module.exports = app;
