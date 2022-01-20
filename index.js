const express = require("express");
const cors = require('cors');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const app = express();
const mongo = require('./connector/mongodb');

const port = process.env.PORT || 8888;

const customerRoute = require('./routes/customer-route');
const adminRoute = require('./routes/admin-route');

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


app.use('/customer', customerRoute);
app.use('/admin', adminRoute);
// app.use('/admin', adminRoute);

expressJSDocSwagger(app)(options);

mongo.mongo((db) => {
    if (db !== false) {
        // Initialize the Swagger middleware
        app.listen(port, () => {
            console.log('Your server is listening on port %d (http://localhost:%d)', port, port);
            console.log('Swagger-ui is available on http://localhost:%d/api-docs', port);
        });
    } else {
        throw 'mongo database error';
    }
});