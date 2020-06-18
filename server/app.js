const express         = require('express');
const path            = require('path');
const cookieParser    = require('cookie-parser');
const logger          = require('morgan');
const cors            = require('cors');
const mongoose        = require('mongoose');
const dotenv        = require("dotenv");

const indexRouter     = require('./routes/index');
const trainsRouter    = require('./routes/trains');
const ticketsRouter   = require('./routes/tickets');

const app             = express();

dotenv.config();

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`, { useFindAndModify: false, useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/api', indexRouter);
app.use('/api/trains', trainsRouter);
app.use('/api/tickets', ticketsRouter);

module.exports = app;




