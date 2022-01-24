const express = require("express");
const cors = require('cors');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const mongo = require('./connector/mongodb');
const cookieParser = require("cookie-parser");

const app = express();

const port = process.env.PORT || 8888;

const customerRoute = require('./routes/customer.route');
const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');

const options = {
    info: {
        title: 'Express API for JSONPlaceholder',
        version: '1.0.0',
        description:
            'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
        license: {
            name: 'Licensed Under MIT',
            url: 'https://spdx.org/licenses/MIT.html',
        },
        contact: {
            name: 'Nattapon(Pae,เป้)'
        },
    },
    security: {
        cookieAuth: {
            type: 'apiKey',
            name: 'accessToken',
            in: 'cookies'
        },
    },
    baseDir: __dirname,
    swaggerUIPath: '/api-docs',
    filesPattern: './routes/*.js',
    servers: [
        {
            url: 'http://localhost:8888',
            description: 'Development server port',
        },
    ]
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname));


app.use('/customer', customerRoute);
app.use('/user', userRoute);
app.use('/auth', authRoute);

expressJSDocSwagger(app)(options);

mongo.mongo((db) => {
    if (db !== false) {
        console.log('MongoDB Connected');
        // Initialize the Swagger middleware
        app.listen(port, () => {
            console.log('Your server is listening on port %d (http://localhost:%d)', port, port);
            console.log('Swagger-ui is available on http://localhost:%d/api-docs', port);
        });
    } else {
        throw 'mongo database error';
    }
});