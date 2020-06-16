const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const MONGODBURI = 'mongodb+srv://davetech:0JcSyzCDJFTrtqWl@cluster0-aq6mn.mongodb.net/microservice';

const mongoose = require('mongoose');
app.use(bodyParser.urlencoded({ extended: false }));

const errorController = require('./controllers/error')
const data = require('./models/data')

app.set('view engine', 'ejs');
app.set('views', 'views');

const appRoutes = require('./routes/routes');
app.use(appRoutes);

app.use(express.static(path.join(__dirname, 'public')));

//app.use(errorController.get404);

mongoose.connect(MONGODBURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(8000)
        console.log('Listening');
    })
    .catch(err => console.log(err));