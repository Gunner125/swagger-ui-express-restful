const express = require('express');
const router = express.Router();

const utils = require('../utils/writer');
const authController = require('../controllers/auth.controller');
/**
 * Login Model
 * @typedef {object} LoginParam
 * @property {string} username.form.required
 * @property {string} password.form.required
 */

/**
 * POST /auth/signin
 * @summary Logged user in.
 * @description Logged user in and return jwt token to session.
 * @tags Auth
 * @param {LoginParam} request.body.required - login user info - application/json
 * @example request - Example Product info.
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
router.post('/signin', (req, res) => {
      authController.signin(req, res)
            .then(function (response) {
                  utils.writeSuccess(res, response);
            })
            .catch(function (response) {
                  utils.writeError(res, response);
            });
});

/**
 * GET /auth/signout
 * @summary Logged user out.
 * @description Logged user out and clear session.
 * @tags Auth
 * @return {object} 200 - Success Response'
 * @return {object} 500 - Error Response
 * @example response - 200 - example success response
 * {
 *   "code" : 200,
 *   "message": "Success Logout"
 * }
 * @example response - 500 - example error response
 * {
 *   "code" : 500,
 *   "message": "Something Error"
 * }
 */
router.get('/signout', (req, res) => {
      authController.signout(req, res)
            .then(function (response) {
                  utils.writeSuccess(res, response);
            })
            .catch(function (response) {
                  utils.writeError(res, response);
            });
});

module.exports = router;