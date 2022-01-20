const express = require('express');
const router = express.Router();

const utils = require('../utils/writer');
const adminController = require('../controllers/admin-controller');

/**
 * Product Model
 * @typedef {object} Product
 * @property {string} productName.form.required
 * @property {number} productPoint.form.required
 */

/**
 * POST /admin/productCreate
 * @summary Admin product create.
 * @description Product create by Admin.
 * @tags Admin
 * @param {Product} request.body.required - Product info - application/json
 * @example request - Example Product info.
 * {
 *   "productName": "Product1",
 *   "productPoint": 10
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
 *   "message": "Something Error"
 * }
 */

router.post('/productCreate', (req, res) => {
    adminController.productCreate(req)
        .then(function (response) {
            utils.writeSuccess(res, response);
        })
        .catch(function (response) {
            utils.writeError(res, response);
        });
});

module.exports = router;