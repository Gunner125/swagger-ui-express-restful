const express = require('express');
const router = express.Router();

const utils = require('../utils/writer');
const authMiddleWare = require('../middleware/auth');
const userController = require('../controllers/user.controller');

/**
 * POST /user/register
 * @summary Register user.
 * @description For using this api purpose.
 * @tags User
 * @param {UserModel} request.body.required - User info - application/json
 * @example request - Example User info.
 * {
 *   "name": "Admin1",
 *   "username": "Admin1",
 *   "password": "1234567890",
 *   "role" : "Admin",
 *   "createDatetime":"2022-01-20 14:27:45"
 * }
 * @return {object} 200 - Success Response'
 * @return {object} 500 - Error Response
 * @example response - 200 - example success response
 * {
 *   "code" : 200,
 *   "message": "User Registered"
 * }
 * @example response - 500 - example error response
 * {
 *   "code" : 500,
 *   "message": "Some Error"
 * }
 */
router.post('/register', (req, res) => {
    userController.register(req)
        .then(function (response) {
            utils.writeSuccess(res, response);
        })
        .catch(function (response) {
            utils.writeError(res, response);
        });
});

/**
 * POST /user/auth/signin
 * @summary Logged user in.
 * @description Logged user in and return jwt token to session.
 * @tags Auth
 * @param {LoginParam} request.body.required - login user info - application/json
 * @example request - Example Product info.
 * {
 *   "username": "Admin1",
 *   "password": "1234567890"
 * }
 * @return {object} 200 - Logged in response'
 * @example response - 200 - example success response
 * {
 *   "code" : 200,
 *   "message": "Logged in"
 * }
 * @return {object} 401 - Error Response
 * @example response - 401 - example error response
 * {
 *   "code" : 401,
 *   "message": "User not found"
 * }
 */
router.post('/auth/signin', (req, res) => {
    userController.userSignIn(req, res)
        .then(function (response) {
            utils.writeSuccess(res, response);
        })
        .catch(function (response) {
            utils.writeError(res, response);
        });
});




/**
 * POST /user/productCreate
 * @summary User product create.
 * @description Product create by User.
 * @tags User
 * @security cookieAuth
 * @param {ProductModel} request.body.required - Product info - application/json
 * @example request - Example Product info.
 * {
 *   "productName": "Product1",
 *   "productPointUse": 10
 * }
 * @return {object} 200 - Success Response'
 * @return {object} 500 - Error Response
 * @example response - 200 - example success response
 * {
 *   "code" : 200,
 *   "message": "Product Created"
 * }
 * @example response - 500 - example error response
 * {
 *   "code" : 500,
 *   "message": "Some Error"
 * }
 */
router.post('/productCreate', (req, res) => {
    authMiddleWare.auth(req, res).then(() => {
        userController.productCreate(req)
            .then(function (response) {
                utils.writeSuccess(res, response);
            })
            .catch(function (response) {
                utils.writeError(res, response);
            });
    }).catch((response) => {
        utils.writeError(res, response);
    });

});


/**
 * GET /user/slipList
 * @summary List of slip of customers.
 * @description List of slip and point that user gained with status customer id required.
 * @tags User
 * @security cookieAuth
 * @return {object} 200 - Success Response'
 * @return {object} 500 - Error Response
 * @example response - 200 - example success response
 * {
 *    "code":200,
 *    "message":"Get Success",
 *    "data":[
 *       {
 *          "_id":"1",
 *          "customer":{
 *              "_id": "61e9716148f60b9265623c06",
 *              "username": "JohnDoe"
 *           },
 *          "slipImg":"images\\1642837209352.jpg"
 *       },
 *       {
 *          "_id":"2",
 *          "customer":{
 *              "_id": "61e9716148f60b9265623c06",
 *              "username": "JohnSmith"
 *           },
 *          "slipImg":"images\\48956156411.jpg"
 *       }
 *    ]
 * }
 * @example response - 500 - example error response
 * {
 *   "code" : 500,
 *   "message": "Something Error"
 * }
 */
router.get('/slipList', (req, res) => {
    authMiddleWare.auth(req, res).then(() => {
        userController.slipList(req)
            .then((response) => {
                utils.writeSuccess(res, response);
            })
            .catch((response) => {
                utils.writeError(res, response);
            });
    }).catch((response) => {
        utils.writeError(res, response);
    });
});

/**
 * POST /user/givenPoint
 * @summary User product slip point given.
 * @description This action request [id] of slip record.
 * @tags User
 * @security cookieAuth
 * @param {GivenPointModel} request.body.required - Slip id and point given - application/json
 * @example request - Example slip Id and point.
 * {
 *   "slipId": "someId",
 *   "pointGiven": 10
 * }
 * @return {object} 200 - Success Response'
 * @return {object} 500 - Error Response
 * @example response - 200 - example success response
 * {
 *   "code" : 200,
 *   "message": "Point given success."
 * }
 * @example response - 500 - example error response
 * {
 *   "code" : 500,
 *   "message": "Some Error"
 * }
 */
router.post('/givenPoint', (req, res) => {
    authMiddleWare.auth(req, res).then(() => {
        userController.slipGivenPoint(req)
            .then(function (response) {
                utils.writeSuccess(res, response);
            })
            .catch(function (response) {
                utils.writeError(res, response);
            });
    }).catch((response) => {
        utils.writeError(res, response);
    });
});






/**
 * Product Model
 * @typedef {object} ProductModel
 * @property {string} productName.form.required
 * @property {number} productPointUse.form.required
 */

/**
 * User Model
 * @typedef {object} UserModel
 * @property {string} name.form.required
 * @property {string} username.form.required
 * @property {string} password.form.required
 * @property {string} role
 * @property {string} createDatetime - - datetime
 */

/**
 * Login  Model
 * @typedef {object} LoginParam
 * @property {string} username.form.required
 * @property {string} password.form.required
 */

/**
 * Given Point  Model
 * @typedef {object} GivenPointModel
 * @property {string} slipId.form.required
 * @property {number} pointGiven.form.required
 */

module.exports = router;