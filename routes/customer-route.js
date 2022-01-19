const express = require('express');
const router = express.Router();

const utils = require('../utils/writer');
const middleWareMulter = require('../middleware/uploadImage');
const customerController = require('../controllers/customer-controller');

/**
 * Customer Model
 * @typedef {object} Customer
 * @property {string} firstname.form.required
 * @property {string} lastname.form.required
 * @property {string} username.form.required
 * @property {string} password.form.required
 * @property {integer} age.form.required - int64
 * @property {string} cover - image cover - binary
 */

/**
 * ImageSlip Model
 * @typedef {object} ImageSlip
 * @property {string} slipImg - image cover - binary
 */





/**
 * POST /customer/register
 * @summary Customer register.
 * @description Each customer can't duplicate.
 * @tags Customer
 * @param {Customer} request.body.required - User info - application/json
 * @example request - Example Customer info.
 * {
 *   "firstname": "John",
 *   "lastname": "Doe",
 *   "username": "JohnDoe",
 *   "password": "1234567890",
 *   "age": 18
 * }
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
 * POST /customer/uploadSlip
 * @summary Customer upload slip.
 * @description Slip is required.
 * @tags Customer
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
router.post('/uploadSlip', middleWareMulter.single('slipImg'), (req, res) => {
    customerController.uploadImgSlip(req)
        .then(function (response) {
            utils.writeSuccess(res, response);
        })
        .catch(function (response) {
            utils.writeError(res, response);
        });
});

module.exports = router;