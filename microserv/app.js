const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const toastr = require('toastr');
const app = express();

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const MONGODBURI = 'mongodb+srv://davetech:0JcSyzCDJFTrtqWl@cluster0-aq6mn.mongodb.net/microservice';

const mongoose = require('mongoose');
const bodyPar = bodyParser.urlencoded({ extended: false });
const jsonPar = bodyParser.json();
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const errorController = require('./controllers/error')
const data = require('./models/data')

app.set('view engine', 'ejs');
app.set('views', 'views');

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader(
//         'Access-Control-Allow-Methods',
//         'OPTIONS, GET, POST, PUT, PATCH, DELETE'
//     );
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
// })

//Routes
/**
 * @swagger
 * /api/v1/urls:
 *  get:
 *    description: Use this endpoint to fetch list of landing pages
 *    responses:
 *      '200':
 *          description: A successful response
 */
/**
 * @swagger
 * /api/v1/urls/{url}:
 *  get:
 *    description: Use this endpoint to fetch information about a particular landing page
 *    responses:
 *      '200':
 *          description: A successful response
 */

const appRoutes = require('./routes/routes');
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/auth');
app.use(bodyPar, authRoutes);
app.use(bodyPar, appRoutes);
app.use('/api/v1', jsonPar, apiRoutes);

//Extended
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Pagetester API',
            description: "Page tester application",
            contact: {
                name: "Pagetester Incorporated"
            },
            servers: ["http://localhost:8000"]
        }
    },
    apis: ["app.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((error, req, res, next) => {
        console.log(error);
        const status = error.statusCode || 500;
        const message = error.message;
        const data = error.data;
        res.status(status).json({ message: message, data: data });
    })
    //app.use(errorController.get404);

app.use(express.static(path.join(__dirname, './public')));

//app.use(errorController.get404);

mongoose.connect(MONGODBURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(8000)
        console.log('Listening');
    })
    .catch(err => console.log(err));