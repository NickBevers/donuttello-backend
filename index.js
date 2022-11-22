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
const usersRouter = require('./routes/api/v1/users');
const indexRouter = require('./routes/index');


// Setup extra settings for express
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configure routes
app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/donuts', donutRouter);

// Connect to the database
mongoose.connect(process.env.DB_CONN, {useNewUrlParser: true, useUnifiedTopology: true, dbName: process.env.DB_NAME});

module.exports = app;
