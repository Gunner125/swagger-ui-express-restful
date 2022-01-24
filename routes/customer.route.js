const express = require('express');
const router = express.Router();

const utils = require('../utils/writer');
const middleWareMulter = require('../middleware/upload.image');
const authMiddleWare = require('../middleware/auth');
const customerController = require('../controllers/customer.controller');


/**
 * POST /customer/register
 * @summary Customer register.
 * @description Each customer can't duplicate.
 * @tags Customer
 * @param {CustomerModel} request.body.required - User info - application/json
 * @example request - Example Customer info.
 * {
 *   "firstname": "John",
 *   "lastname": "Doe",
 *   "username": "JohnDoe",
 *   "password": "1234567890",
 *   "age": 18,
 *   "role" : "Customer",
 *   "registerDate":"2022-01-20 14:27:45"
 * }
 * @return {object} 201 - Success Response'
 * @return {object} 500 - Error Response
 * @example response - 201 - example success response
 * {
 *   "code" : 201,
 *   "message": "Customer Registered"
 * }
 * @example response - 500 - example error response
 * {
 *   "code" : 500,
 *   "message": "Something Error"
 * }
 */

router.post('/register', (req, res) => {
    customerController.customerRegister(req)
        .then(function (response) {
            utils.writeSuccess(res, response);
        })
        .catch(function (response) {
            utils.writeError(res, response);
        });
});

/**
 * POST /customer/auth/signin
 * @summary Logged customer in.
 * @description Logged customer in and return jwt token to cookie.
 * @tags Auth
 * @param {LoginParam} request.body.required - login customer info system- application/json
 * @example request - Example Login info.
 * {
 *   "username": "JohnDoe",
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
    customerController.customerSignIn(req, res)
        .then(function (response) {
            utils.writeSuccess(res, response);
        })
        .catch(function (response) {
            utils.writeError(res, response);
        });
});

/**
 * POST /customer/uploadProductSlip
 * @summary Customer upload slip.
 * @description Customer upload slip for gaining point.
 * @tags Customer
 * @security cookieAuth
 * @param {ImageSlip} request.body.required - Slip Upload - multipart/form-data
 * @return {object} 200 - Success Response'
 * @return {object} 500 - Error Response
 * @example response - 200 - example success response
 * {
 *   "code" : 200,
 *   "message": "Upload Completed"
 * }
 * @example response - 500 - example error response
 * {
 *   "code" : 500,
 *   "message": "Something Error"
 * }
 */
router.post('/uploadProductSlip', middleWareMulter.single('slipImg'), (req, res) => {
    authMiddleWare.auth(req, res).then(() => {
        customerController.uploadImgSlip(req)
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
 * GET /customer/slipList
 * @summary List of slip and point that user gained.
 * @description List of slip and point that user gained with status customer id required.
 * @tags Customer
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
 *          "slipImg":"images\\1642837209352.jpg"
 *       },
 *       {
 *          "_id":"2",
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
        customerController.slipList(req)
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
 * GET /customer/pointSummary
 * @summary Summary point of customer.
 * @description Summary point of customer.
 * @tags Customer
 * @security cookieAuth
 * @return {object} 200 - Success Response'
 * @return {object} 500 - Error Response
 * @example response - 200 - example success response
 * {
 *   "code" : 200,
 *   "message": "Customer Registered"
 * }
 * @example response - 500 - example error response
 * {
 *   "code" : 500,
 *   "message": "Something Error"
 * }
 */
router.get('/pointSummary', (req, res) => {
    authMiddleWare.auth(req, res).then(() => {
        customerController.pointSummary(req)
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
 * GET /customer/productList
 * @summary List of product and point.
 * @description List of product and point used for converting point.[productId] and [userId] is required
 * @tags Customer
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
 *          "productName": "Product1",
 *          "productPointUse": 10
 *       },
 *       {
 *          "_id":"2",
 *          "productName": "Product2",
 *          "productPointUse": 5
 *       }
 *    ]
 * }
 * @example response - 500 - example error response
 * {
 *   "code" : 500,
 *   "message": "Something Error"
 * }
 */
router.get('/productList', (req, res) => {
    authMiddleWare.auth(req, res).then(() => {
        customerController.productList(req)
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
 * POST /customer/pointConvert
 * @summary Customer convert point.
 * @description Customer choose product for converting. [productId] and [customerId] is required.
 * @tags Customer
 * @security cookieAuth
 * @param {PointConvertModel} request.body.required - [productId] and [customerId] - application/json
 * @example request - Example Login info.
 * {
 *   "productId": "someId"
 * }
 * @return {object} 200 - Success Response'
 * @return {object} 500 - Error Response
 * @example response - 200 - example success response
 * {
 *   "code" : 200,
 *   "message": "Point convert Success"
 * }
 * @example response - 500 - example error response
 * {
 *   "code" : 500,
 *   "message": "Something Error"
 * }
 */
router.post('/pointConvert', (req, res) => {
    authMiddleWare.auth(req, res).then(() => {
        customerController.pointConvert(req)
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
 * GET /customer/pointConvertedHistory
 * @summary History of converted product and point.
 * @description History of converted product and point
 * @tags Customer
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
 *          "productName": "Product1",
 *          "productPointconvert": 1,
 *          "convertDate": "2022-01-24T05:45:14.278+00:00"
 *       },
 *       {
 *          "_id":"1",
 *          "productName": "Product1",
 *          "productPointconvert": 2,
 *          "convertDate" : "2022-01-24T05:45:14.278+00:00"
 *       }
 *    ]
 * }
 * @example response - 500 - example error response
 * {
 *   "code" : 500,
 *   "message": "Something Error"
 * }
 */
 router.get('/pointConvertedHistory', (req, res) => {
    authMiddleWare.auth(req, res).then(() => {
        customerController.pointConvertedHistory(req)
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
 * Customer Model
 * @typedef {object} CustomerModel
 * @property {string} firstname.form.required
 * @property {string} lastname.form.required
 * @property {string} username.form.required
 * @property {string} password.form.required
 * @property {integer} age.form.required - - int64
 * @property {string} role
 * @property {string} registerDate - - datetime
 */

/**
 * ImageSlip Model
 * @typedef {object} ImageSlip
 * @property {string} slipImg - image cover - binary
 */

/**
 * Login  Model
 * @typedef {object} LoginParam
 * @property {string} username.form.required
 * @property {string} password.form.required
 */

/**
 * PointConvert  Model
 * @typedef {object} PointConvertModel
 * @property {string} productId.form.required
 */

module.exports = router;